import { useState } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export const CropImage = () => {

    const [crop, setCrop] = useState(null);
    const [src, setSrc] = useState(null);
    const [preview, setPreview] = useState(null);

    const getCropData = async () => {
        if (cropper) {
            const file = await fetch(cropper.getCroppedCanvas().toDataURL())
                .then((res) => res.blob())
                .then((blob) => {
                    return new File([blob], "newAvatar.png", { type: "image/png" });
                });
            if (file) {
                authService
                    .uploadAvatar(userId, file)
                    .then(() => {
                        refetchUser(userId);
                        cancelEdit();
                    })
                    .catch((e) => alert(e));
            }
        }
    };

    return (
        <div>
            {!src && (
                <div className=" custom-thumbnail"
                    onClick={() => {
                        document.getElementById("thumbnail").click();
                    }}>
                    <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className=" hidden"
                        onChange={(e) => {
                            const objectUrl = URL.createObjectURL(e.target.files[0]);
                            setSrc(objectUrl);
                        }}
                    />
                </div>
            )}

            {src && (
                <Cropper
                    src={src }
                    style={{ height: 400, width: 400 }}
                    initialAspectRatio={4 / 3}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    guides={false}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                />
            )}

            {
                preview && (
                    <img src={preview} alt='CropResult' title='CropResult' />
                )
            }

            <button onClick={getCropData}>Crop Image</button>
        </div>
    )
}