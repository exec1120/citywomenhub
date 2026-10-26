import React, {useMemo, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {createClient} from '@supabase/supabase-js';
import {Search, Users, CalendarDays, Trophy, BookOpen, ExternalLink, ArrowLeft, Database, RefreshCw} from 'lucide-react';
import './style.css';

const localRoster = [
[1,'Eartha Cumings','GK','SCO'],[2,'Risa Shimizu','DF','JPN'],[4,'Jade Rose','DF','CAN'],[5,'Alex Greenwood','DF','ENG'],
[6,'Grace Clinton','MF','ENG'],[7,'Beth Mead','FW','ENG'],[8,'Mary Fowler','FW','AUS'],[9,'Khadija Shaw','FW','JAM'],
[10,'Vivianne Miedema','FW','NED'],[11,'Lauren Hemp','FW','ENG'],[13,'Laura Wienroither','DF','AUT'],[14,'Anna Moorhouse','GK','ENG'],
[17,'Sam Coffey','MF','USA'],[18,'Kerstin Casparij','DF','NED'],[19,'Laura Blindkilde Brown','MF','ENG'],[20,'Aoba Fujino','FW','JPN'],
[21,'Niamh Charles','DF','ENG'],[22,'Sydney Lohmann','MF','GER'],[24,'Iman Beney','FW','SUI'],[25,'Yui Hasegawa','MF','JPN'],
[27,'Rebecca Knaak','DF','GER'],[28,'Gracie Prior','DF','ENG'],[31,'Ayaka Yamashita','GK','JPN'],[37,'Carlotta Wamser','DF','GER'],
[47,'Sacha Lewis','DF','ENG'],[53,'Mayzee Davies','DF','WAL']
].map(([number,name,position,nationality])=>({number,name,position,nationality,group:'First Team',bio:'个人档案待以俱乐部及赛事官方资料核验补全。',sources:['曼城官方球队页','UEFA / WSL公开资料']}));

const positions = {GK:'门将',DF:'后卫',MF:'中场',FW:'前锋'};
const tabs = [{id:'squad',label:'球员数据库',icon:Users},{id:'fixtures',label:'赛程与比分',icon:CalendarDays},{id:'history',label:'历史与档案',icon:BookOpen}];

function App(){
 const [tab,setTab]=useState('squad'),[query,setQuery]=useState(''),[position,setPosition]=useState('All'),[group,setGroup]=useState('All'),[selected,setSelected]=useState(null);
 const [players,setPlayers]=useState(localRoster),[dataMode,setDataMode]=useState('本地演示名单');
 const [lastSync,setLastSync]=useState('尚未同步外部数据');
 const supabaseUrl=import.meta.env.VITE_SUPABASE_URL, supabaseKey=import.meta.env.VITE_SUPABASE_ANON_KEY;
 const supabase=supabaseUrl&&supabaseKey?createClient(supabaseUrl,supabaseKey):null;

 useEffect(()=>{let active=true;(async()=>{if(!supabase)return;try{const {data,error}=await supabase.from('players').select('*').order('shirt_number');if(error)throw error;if(active&&data?.length){setPlayers(data.map(p=>({number:p.shirt_number,name:p.full_name,position:p.position,nationality:p.nationality,group:p.squad_group||'First Team',bio:p.bio||'暂无已核验简介',sources:p.source_names||[]})));setDataMode('Supabase 数据库');setLastSync(new Date().toLocaleString('zh-CN'));}}catch(e){console.warn('Supabase尚未配置或读取失败',e)}})();return()=>{active=false}},[]);
 const shown=useMemo(()=>players.filter(p=>(`${p.name} ${p.number??''} ${p.position} ${p.nationality} ${p.group}`).toLowerCase().includes(query.toLowerCase())&&(position==='All'||p.position===position)&&(group==='All'||p.group===group)),[players,query,position,group]);
 const syncLabel=supabase?'Supabase连接已配置':'未连接外部数据库';
 return <><header><div className="top"><b>CITY WOMEN HUB</b><span>非官方球迷数据库</span></div><div className="hero"><div><div className="eyebrow">MANCHESTER CITY WOMEN</div><h1>曼城女足<br/>全信息数据库</h1><p>球员档案、阵容搜索、赛程、比赛数据与球队历史。以官方资料核验，综合公开数据库补充。</p></div><div className="hero-card"><strong>{players.length}</strong><small>当前载入球员条目</small><div className="tag">{dataMode}</div></div></div></header>
 <main>{selected?<PlayerProfile player={selected} onBack={()=>setSelected(null)}/>:<>
 <div className="nav">{tabs.map(t=><button className={tab===t.id?'active':''} onClick={()=>setTab(t.id)} key={t.id}><t.icon size={16}/>{t.label}</button>)}</div>
 {tab==='squad'&&<><div className="filters"><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索球员姓名、号码、国籍…"/></div><select value={position} onChange={e=>setPosition(e.target.value)}><option value="All">全部位置</option>{Object.entries(positions).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select><select value={group} onChange={e=>setGroup(e.target.value)}><option value="All">所有名单分类</option><option value="First Team">一线队</option><option value="Academy">青训</option><option value="Former">历史球员</option></select></div><div className="sectionline"><h2>球员数据库</h2><span>匹配 {shown.length} / {players.length} 位</span></div><div className="grid">{shown.map(p=><button className="player" key={`${p.number}-${p.name}`} onClick={()=>setSelected(p)}><div className="num">{p.number??'—'}</div><div className="player-info"><b>{p.name}</b><p>{positions[p.position]||p.position||'位置待核验'} · {p.nationality||'国籍待核验'}</p><small>{p.group||'名单分类待核验'}</small></div><span className="chevron">›</span></button>)}</div>{!shown.length&&<div className="empty">没有找到符合条件的球员。</div>}<p className="disclaimer">重要：此版本内置的是起始名册示例，不能视为完整、实时注册名单。球员名单、号码及状态须按当前赛季官方公告持续核验。青训与历史球员会逐步导入。</p></>}
 {tab==='fixtures'&&<div className="blank"><CalendarDays size={30}/><h2>赛程与比分</h2><p>下一步接入赛事数据源后，在这里展示比赛日期、对手、比分、赛事、首发、替补、进球和助攻。</p><span className="pill">需要配置数据服务 API</span></div>}
 {tab==='history'&&<div className="blank"><Trophy size={30}/><h2>历史与档案</h2><p>准备收录历届球员、主教练、队长、荣誉、重要比赛、转会履历与青训档案。来源和核验状态会在条目中标注。</p><span className="pill">档案内容持续补充</span></div>}
 <section className="status"><div><Database size={17}/><span>{syncLabel}</span></div><small>最近读取：{lastSync}</small></section>
 <section className="source"><b>资料入口</b><a href="https://www.mancity.com/teams/womens" target="_blank" rel="noreferrer">曼城女足官网 <ExternalLink size={14}/></a><a href="https://www.uefa.com/womenschampionsleague/clubs/2603520--man-city/squad/" target="_blank" rel="noreferrer">UEFA 阵容 <ExternalLink size={14}/></a><a href="https://www.wslfootball.com/" target="_blank" rel="noreferrer">WSL Football <ExternalLink size={14}/></a></section>
 </>}</main><footer>City Women Hub · 非官方球迷项目。信息以俱乐部及赛事官方公告为准。第三方统计与转会资料可能存在更新延迟。</footer></>;
}
function PlayerProfile({player:p,onBack}){return <div className="profile"><button className="back" onClick={onBack}><ArrowLeft size={16}/>返回球员列表</button><div className="profile-top"><div className="profile-number">{p.number??'—'}</div><div><span className="eyebrow dark">PLAYER PROFILE</span><h2>{p.name}</h2><p>{positions[p.position]||p.position} · {p.nationality||'国籍待核验'} · {p.group||'名单分类待核验'}</p></div></div><div className="profile-columns"><section><h3>个人简介</h3><p>{p.bio||'暂无已核验简介。后续将以曼城官方、UEFA、WSL及公开数据库交叉补充。'}</p><h3>数据与履历</h3><p>出场、进球、助攻、国家队履历、合同与转会信息将在接入数据服务并核验后展示。</p></section><aside><h3>资料来源</h3>{(p.sources||['待补充来源']).map((s,i)=><div className="source-item" key={i}>{s}</div>)}<p className="tiny">档案状态：基础条目已建立，详细内容待核验完善。</p></aside></div></div>}
createRoot(document.getElementById('root')).render(<App/>);
