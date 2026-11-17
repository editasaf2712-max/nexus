import SectionView from '../../app/section-view';
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){const params=await searchParams;return <SectionView section="explore" searchQuery={params.q||''}/>}
