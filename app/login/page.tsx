import SectionView from '../../app/section-view';
export default function Page({searchParams}:{searchParams:{auth_error?:string}}){return <SectionView section="login" authError={searchParams.auth_error?.slice(0,300)}/>}
