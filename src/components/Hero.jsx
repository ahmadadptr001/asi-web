import { useState, useEffect, useRef } from "react";

import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { AutoComplete } from "primereact/autocomplete";

import heroImage from "/src/assets/hero.jpg";
import { readAnime } from "../utils/dataAnime";

const Hero = ({ anime, setAnime, setItemFilter, setVisibleSidebarRight }) => {
        const itemsSpeedDial = [
                {
                        label: 'Login Admin',
                        icon: 'pi pi-user',
                        command: () => setVisibleSidebarRight(true)
                },
                {
                        label: 'Cari Anime',
                        icon: 'pi pi-search',
                        command: () => setVisibleDialogSearch(!visibleDialogSearch)
                },
                {
                        label: 'Naik',
                        icon: 'pi pi-arrow-up',
                        command: () => {window.scrollTo({top: 0, behavior: "smooth"})}
                }
        ]

        const toast = useRef(null);
        const [visibleDialogSearch, setVisibleDialogSearch] = useState(false);
        const [selectedAnime, setSelectedAnime] = useState(null);
        const [filteredAnime, setFilteredAnime] = useState(null);

        useEffect(() => {
                ( async() => {
                        const dataAnime = await readAnime();
                        if (dataAnime.length === 0) {
                                toast.current.show({severity:"warn", summary:"Peringatan", detail:"data tidak terbaca tolong refresh kembali web nya;)"});
                        }
                        setAnime(dataAnime);
                })()
        }, [anime])

        const searchAnime = (event) => {
                setTimeout(() => {
                        let _filterdAnime;

                        if (!event.query.trim().length) {
                                _filterdAnime = [...anime]
                        } else {
                                _filterdAnime = anime.filter((anim) => {
                                        return anim.judul.toLowerCase().includes(event.query.toLowerCase());
                                })
                        }

                        setFilteredAnime(_filterdAnime);
                }, 250);
        }

        const bodyDialog = (item) => {
                return (
                        <div className="flex items-center">
                                <img
                                        alt={item.judul}
                                        src={item.gambar}
                                        className="object-cover rounded-full"
                                        style={{width: '18px'}}
                                />
                                <div className="ms-1">{item.judul}</div>
                        </div>
                );
        }

        return (
                <>
                        <Toast ref={toast} className="!text-[.55rem] xs:!text-[.7rem] lg:!text-sm"/>
                        <section className="hero text-center py-7 px-7 text-white relative overflow-y-hidden h-[180px] xs:h-[200px] sm:h-[300px]">
                                <img src={heroImage} alt="anime walpaper" className="absolute inset-0 object-cover -z-1"/>
                                <p className="font-bold sm:text-2xl text-[.6rem] xs:text-sm">DAPATKAN INFORMASI TERBARU JADWAL ANIME</p>
                                <p className="mt-1 text-[.5rem] xs:text-[0.6rem] sm:text-sm">Jadilah wibu sejati dan mulai mengeksplore jam tayang anime</p>
                                <Button onClick={() => setVisibleDialogSearch(!visibleDialogSearch)} className="card !mt-10 !px-3 !py-2 sm:!px-4 sm:!py-3 !text-[.4rem] xs:!text-[.6rem] sm:!text-base" label="Cari anime..." icon="!text-[.5rem] xs:!text-[.7rem] sm:!text-[base] pi pi-search"/>
                        </section>
                        <Tooltip target=".speeddial-bottom-right .p-speeddial-action" className="!text-sm w-[120px]"/>
                        <SpeedDial model={itemsSpeedDial} direction="up" className="!fixed speeddial-bottom-right  right-6 bottom-6" buttonClassName=" !border-none focus:!border-none p-button-warning !bg-yellow-500"/>

                        <Dialog key={anime} header="Cari Anime 😎 " visible={visibleDialogSearch} className="w-[96%] xs:w-auto" onHide={()=> setVisibleDialogSearch(!visibleDialogSearch)}>
                                <div className="flex items-center gap-2 justify-center flex-wrap mt-2">
                                        <AutoComplete
                                                field="judul" 
                                                value={selectedAnime} 
                                                suggestions={filteredAnime} 
                                                completeMethod={searchAnime} 
                                                onChange={(e) => setSelectedAnime(e.value)} 
                                                itemTemplate={bodyDialog}
                                        />
                                        <Button icon="pi pi-search" className="basis-full" onClick={() => { setItemFilter(selectedAnime);setVisibleDialogSearch(!visibleDialogSearch) }}/>
                                </div>
                                </Dialog>
                </>
        )
}

export default Hero;