"""Servidor HTTP local i encaminador de l'aplicació TalentMatch AI.

Responsabilitats d'aquest mòdul:
1. Servir els fitxers estàtics del frontend.
2. Rebre documents mitjançant formularis multipart.
3. Delegar l'anàlisi del CV al servei especialitzat.
4. Retornar respostes JSON al navegador.

La lògica d'extracció no viu aquí; es troba a ``backend/services/cv_reader.py``.
"""

from __future__ import annotations

import json
import mimetypes
from email.parser import BytesParser
from email.policy import default
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from backend.services.cv_reader import MAX_FILE_SIZE, analyse_cv


ROOT = Path(__file__).resolve().parent.parent
FRONTEND_ROOT = ROOT / "frontend"
HOST = "127.0.0.1"
PORT = 8000
PAGE_ROUTES = {
    "/": "index.html",
    "/index.html": "index.html",
    "/candidate": "pages/candidate.html",
    "/candidate.html": "pages/candidate.html",
    "/company": "pages/company.html",
    "/company.html": "pages/company.html",
}


class TalentMatchHandler(BaseHTTPRequestHandler):
    server_version = "TalentMatch/0.1"

    def do_GET(self) -> None:
        """Serveix pàgines HTML i recursos estàtics de forma segura."""

        path = unquote(urlparse(self.path).path)
        relative_path = PAGE_ROUTES.get(path)

        # Els recursos CSS, JS i imatges es poden demanar directament.
        if relative_path is None and path.startswith(("/css/", "/js/", "/assets/")):
            relative_path = path.lstrip("/")

        if relative_path is None:
            self.send_error(404, "Recurs no trobat")
            return

        # ``resolve`` evita que una ruta amb ".." pugui sortir del frontend.
        file_path = (FRONTEND_ROOT / relative_path).resolve()
        if FRONTEND_ROOT.resolve() not in file_path.parents:
            self.send_error(403, "Ruta no permesa")
            return

        if not file_path.is_file():
            self.send_error(404, "Fitxer no trobat")
            return

        content_type, _ = mimetypes.guess_type(file_path.name)
        payload = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", f"{content_type or 'application/octet-stream'}; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self) -> None:
        if urlparse(self.path).path != "/api/analyze":
            self._send_json(404, {"error": "Endpoint no trobat."})
            return

        try:
            file_name, file_bytes, language = self._read_uploaded_file()
            result = analyse_cv(file_name, file_bytes, language)
            self._send_json(200, result)
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
        except Exception as exc:
            print(f"Error processant el CV: {exc}")
            self._send_json(
                500,
                {"error": "No s'ha pogut processar el document. Prova-ho amb un altre fitxer."},
            )

    def _read_uploaded_file(self) -> tuple[str, bytes, str]:
        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            raise ValueError("La petició ha d'incloure un document.")

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            raise ValueError("No s'ha rebut cap document.")
        if content_length > MAX_FILE_SIZE + 1_000_000:
            raise ValueError("El document supera el límit de 10 MB.")

        body = self.rfile.read(content_length)
        message = BytesParser(policy=default).parsebytes(
            b"Content-Type: " + content_type.encode("utf-8") + b"\r\n\r\n" + body
        )

        filename = ""
        payload = b""
        language = "ca"
        for part in message.iter_parts():
            if part.get_content_disposition() != "form-data":
                continue
            field_name = part.get_param("name", header="content-disposition")
            if field_name == "language":
                value = (part.get_content() or "").strip()
                language = value if value in {"ca", "es", "en"} else "ca"
            elif field_name == "cv":
                filename = Path(part.get_filename() or "").name
                payload = part.get_payload(decode=True) or b""

        if not filename or not payload:
            raise ValueError("No s'ha trobat el document o està buit.")
        return filename, payload, language

    def _send_json(self, status: int, data: dict) -> None:
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, format: str, *args: object) -> None:
        print(f"[TalentMatch] {self.address_string()} - {format % args}")


def run() -> None:
    server = ThreadingHTTPServer((HOST, PORT), TalentMatchHandler)
    print(f"TalentMatch disponible a http://localhost:{PORT}")
    print("Prem Ctrl+C per aturar el servidor.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor aturat.")
    finally:
        server.server_close()


if __name__ == "__main__":
    run()
