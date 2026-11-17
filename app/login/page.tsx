import SectionView from '../../app/section-view';
export default async function Page({searchParams}:{searchParams:Promise<{auth_error?:string}>}){const params=await searchParams;return <SectionView section="login" authError={params.auth_error?.slice(0,300)}/>}
