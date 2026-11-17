import SectionView from '../../app/section-view';
export default function Page({searchParams}:{searchParams:{q?:string}}){return <SectionView section="explore" searchQuery={searchParams.q||''}/>}
