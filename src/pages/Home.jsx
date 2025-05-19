import { useState } from "react";

import Content from "../components/Content";
import Hero from "../components/Hero";
import Navigasi from "../components/Navigasi";
import SidebarRight from "../components/SidebarRight";
import Footer from "../components/Footer";

const Home = () => {

        const [anime, setAnime] = useState([]);
        const [itemFilter, setItemFilter] = useState([]);
        const [visibleSidebarRight, setVisibleSidebarRight] = useState(false);

        return (
                <>
                        <Navigasi setVisibleSidebarRight={setVisibleSidebarRight} />
                        <SidebarRight visibleSidebarRight={visibleSidebarRight} setVisibleSidebarRight={setVisibleSidebarRight} />
                        <Hero anime={anime} setAnime={setAnime} setItemFilter={setItemFilter} setVisibleSidebarRight={setVisibleSidebarRight}/>
                        <Content anime={anime} itemFilter={itemFilter} />
                        <Footer />
                </>
        )
}

export default Home