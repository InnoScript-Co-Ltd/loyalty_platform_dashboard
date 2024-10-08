import { Button } from "primereact/button"


export const FormMainAction = ({ cancel, onCancel, submit, onSubmit, loading }) => {

    return (
        <div className="col-12 mt-3">
            <div className="flex flex-row justify-content-end align-items-center">
                <Button
                    className="mx-2"
                    label={cancel}
                    severity="secondary"
                    outlined
                    size='small'
                    disabled={loading}
                    onClick={onCancel}
                />

                <Button
                    className="mx-2"
                    label={submit}
                    severity="danger"
                    size='small'
                    disabled={loading}
                    onClick={onSubmit}
                />
            </div>
        </div>
    )
}
