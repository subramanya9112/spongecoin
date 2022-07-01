import React from 'react';
import Header from '../Header';
import './index.scss';
import mainPageBackgrndImg from "./../../../images/1.jpg";
import mainPageContentBackgrndImg from "./../../../images/2.jpg";

export default function Index() {
    return (
        <Header
            content={
                <div className="mainPage">
                    <div className="mainPageHeading">
                        <img src={mainPageBackgrndImg} alt="mainPageBackgrndImg" className="mainPageBackgrndImg" />
                        <div className="mainPagecontainer">
                            <h1>SPONGE COIN</h1>
                        </div>
                    </div>
                    <div className="mainPagecontent">
                        <img src={mainPageContentBackgrndImg} alt="mainPageContentBackgrndImg" className="mainPageContentBackgrndImg" />
                        <div className="mainPageCard">
                            <div className="mainPageCardRow">
                                <div className="mainPageCards">
                                    <div className="mainPageCardHeading">CREATE SIDE CHAIN</div>
                                    <div className="mainPageCardContent">Create your own SIDE CHAIN in your name</div>
                                </div>
                                <div className="mainPageCards">
                                    <div className="mainPageCardHeading">EASY TO INSTALL</div>
                                    <div className="mainPageCardContent">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                                        molestiae quas vel sint repudiandae consequuntur voluptatum laborum</div>
                                </div>
                            </div>
                            <div className="mainPageCardRow">
                                <div className="mainPageCards">
                                    <div className="mainPageCardHeading">LOW TRANSACTION TIME</div>
                                    <div className="mainPageCardContent">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                                        molestiae quas vel sint repudiandae consequuntur voluptatum laborum</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    )
}
