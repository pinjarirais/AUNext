import ExcelUploader from "@/component/upload-xcl";
import { cookies } from "next/headers";

async function UploadData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <>
      <ExcelUploader token={token} />
    </>
  )
}

export default UploadData
