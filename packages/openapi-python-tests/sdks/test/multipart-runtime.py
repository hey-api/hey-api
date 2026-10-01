import sys
from email.parser import BytesParser
from email.policy import default

import httpx


def main() -> None:
    sys.path.insert(0, sys.argv[1])
    from multipart_runtime.pydantic_gen import Tags, UploadMetadata
    from multipart_runtime.sdk_gen import Sdk

    image = b"\x89PNG\x00\xff"
    second_image = b"\x89PNG\x01\xfe"

    expected_parts = {
        "/images": [("image", "image", image), ("caption", None, b"hello")],
        "/images/ref": [("image", "image", image), ("caption", None, b"hello")],
        "/images/batch": [
            ("images", "images", image),
            ("images", "images", second_image),
            ("caption", None, b"batch"),
        ],
        "/fields": [
            ("count", None, b"0"),
            ("enabled", None, b"false"),
            ("metadata", None, '{"label":"中文"}'.encode()),
            ("options", None, b'{"active":false}'),
            ("tags", None, b"alpha"),
            ("tags", None, "中文".encode()),
            ("counts", None, b"0"),
            ("counts", None, b"2"),
            ("flags", None, b"true"),
            ("flags", None, b"false"),
            ("records", None, b'{"active":true}'),
            ("records", None, b'{"count":2}'),
            ("labels", None, b"one"),
            ("labels", None, b"two"),
        ],
    }
    seen_paths = []

    def handle(request: httpx.Request) -> httpx.Response:
        assert request.headers["content-type"].startswith("multipart/form-data; boundary=")
        message = BytesParser(policy=default).parsebytes(
            b"Content-Type: " + request.headers["content-type"].encode() + b"\r\n\r\n" + request.content
        )
        parts = [
            (part.get_param("name", header="content-disposition"), part.get_filename(), part.get_payload(decode=True))
            for part in message.iter_parts()
        ]
        assert parts == expected_parts[request.url.path], parts
        seen_paths.append(request.url.path)
        return httpx.Response(204)

    with httpx.Client(
        base_url="https://example.test",
        transport=httpx.MockTransport(handle),
    ) as client:
        sdk = Sdk(client=client)
        assert sdk.upload_image(image=image, caption="hello").status_code == 204
        assert sdk.upload_image_ref(image=image, caption="hello").status_code == 204
        assert sdk.upload_images(images=[image, second_image], caption="batch").status_code == 204
        assert (
            sdk.upload_fields(
                count=0,
                enabled=False,
                metadata=UploadMetadata(label="中文"),
                options={"active": False},
                tags=["alpha", "中文"],
                counts=[0, 2],
                flags=[True, False],
                records=[{"active": True}, {"count": 2}],
                labels=Tags(root=["one", "two"]),
            ).status_code
            == 204
        )

    assert seen_paths == list(expected_parts)


if __name__ == "__main__":
    main()
