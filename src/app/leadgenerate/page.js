import ExcelUploader from '../../component/UploadXcl'
import { cookies } from "next/headers";

function UploadData() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <>
      <ExcelUploader token={token} />
    </>
  )
}

export default UploadData
