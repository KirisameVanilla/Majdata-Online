'use client'
import React, { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import useSWR from 'swr';
import Majdata from '../majdata'
import { apiroot1 } from '../apiroot';

export default function Page() {
  return (
    <>
      <div className='bg'></div>
      <div className='seprate'></div>
      <h1><img className="xxlb"src="./xxlb.jpg" onClick={()=>alert("不要点我 操你妈")}></img>MMFC 6TH</h1>
      <div className='links'>
      <div className='linkContent'><a href='../'>返回</a></div>
      <div className='linkContent'><a href='https://www.maimaimfc.ink/6thstart'>6th报名窗口</a></div>
      <div className='linkContent'><a href='https://www.maimaimfc.ink/'>打分会场</a></div>      </div>
      <Majdata />
      <TheList />
    </>
  )
}


function CoverPic({id}){
  let url = apiroot1 + `/Image/${id}` 
  let urlfull = apiroot1 +`/ImageFull/${id}` 
  return (
    <><PhotoProvider bannerVisible={false} loadingElement={<div>Loading...</div>}>
      <PhotoView src={urlfull} >
        <img className="songImg" src={url} alt="" />
        
      </PhotoView>
    </PhotoProvider>
    <div className='songId'>{id}</div>
    </>
);
}

function Levels({levels, songid}){
  for(let i=0;i<levels.length;i++){
    if(levels[i]==null){
      levels[i] = "-"
    }
  }
  const scrollToTop = () => {
    let sTop = document.documentElement.scrollTop || document.body.scrollTop
    if (sTop > 0.1) {
        window.requestAnimationFrame(scrollToTop)
        window.scrollTo(0, sTop - sTop / 9)
    }
  }

  const levelClickCallback = e =>{
    scrollToTop()
    window.unitySendMessage("HandleJSMessages","ReceiveMessage",'jsnmsl\n'+apiroot1 + '\n' +songid +'\n'+e.target.id)
  }
  return(
    <>
    <div className='songLevel'  id="lv0" onClick={levelClickCallback}>{levels[0]}</div>
    <div className='songLevel'  id="lv1" onClick={levelClickCallback}>{levels[1]}</div>
    <div className='songLevel'  id="lv2" onClick={levelClickCallback}>{levels[2]}</div>
    <div className='songLevel'  id="lv3" onClick={levelClickCallback}>{levels[3]}</div>
    <div className='songLevel'  id="lv4" onClick={levelClickCallback}>{levels[4]}</div>
    <div className='songLevel'  id="lv5" onClick={levelClickCallback}>{levels[5]}</div>
    <div className='songLevel'  id="lv6" onClick={levelClickCallback}>{levels[6]}</div>
    </>
  )
}

function SearchBar({onChange}){
  return (
  <div className='searchDiv'>
    <input type='text' className='searchInput' placeholder='Search' onChange={onChange}/>
  </div>);
}

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function TheList() {
  const { data, error, isLoading } = useSWR(apiroot1 + "/SongList", fetcher);
  const [filteredList, setFilteredList] = new useState(data);

  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div className='loading'>Loading List...</div>;
  }
  data.sort((a, b) => { return b.Id - a.Id; });

  const filterBySearch = (e) => {
    let dataf = data.filter(o => (
      o.Designer?.toLowerCase().includes(e.target.value.toLowerCase()) ||
      o.Title?.toLowerCase().includes(e.target.value.toLowerCase()) ||
      o.Artist?.toLowerCase().includes(e.target.value.toLowerCase()) ||
      o.Levels.some(i => i == e.target.value) ||
      o.Id == e.target.value
    ));
    setFilteredList(dataf);
  };

  if (filteredList == undefined) {
    setFilteredList(data);
    return <SearchBar onChange={filterBySearch} />;
  }

  const list = filteredList.map(o => (
    <div key={o.Id}>
      <div className="songCard">
        <CoverPic id={o.Id} />
        <div className='songInfo'>
          <div className='songTitle'>{o.Title}</div>
          <div className='songArtist'>{o.Artist == "" || o.Artist == null ? "-" : o.Artist}</div>
          <div className='songDesigner'>By: {o.Designer}</div>
          <Levels levels={o.Levels} songid={o.Id} />
        </div>
      </div>
    </div>));
  // 渲染数据
  return (<>
    <SearchBar onChange={e => filterBySearch(e)} />
    <div className='theList'>{list}</div>
  </>);
}