import { Lightbulb, MessageSquareText, GraduationCap, Code2, type LucideIcon } from 'lucide-react';
export type ModuleKey = 'debatehub'|'skillshare'|'ideamarket'|'devspace';
export const modules: { key: ModuleKey; name: string; description: string; icon: LucideIcon; color: string; tint: string; path: string }[] = [
 {key:'debatehub',name:'DebateHub',description:'Fikirleri tartış',icon:MessageSquareText,color:'#7657f6',tint:'#f1eeff',path:'/modules/debatehub'},
 {key:'skillshare',name:'SkillShare',description:'Birlikte öğren',icon:GraduationCap,color:'#17a990',tint:'#e8faf6',path:'/modules/skillshare'},
 {key:'ideamarket',name:'IdeaMarket',description:'Fikrini büyüt',icon:Lightbulb,color:'#e79b35',tint:'#fff5e8',path:'/modules/ideamarket'},
 {key:'devspace',name:'DevSpace',description:'Projeni sergile',icon:Code2,color:'#4488e8',tint:'#eaf3ff',path:'/modules/devspace'},
];
