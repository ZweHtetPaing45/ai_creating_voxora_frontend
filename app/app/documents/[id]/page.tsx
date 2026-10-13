import { DocumentWorkspace } from "../../../../src/features/documents/DocumentWorkspace";
export default async function DocumentPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <DocumentWorkspace documentId={Number(id)}/>}
