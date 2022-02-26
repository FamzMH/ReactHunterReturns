import React from 'react';
import { Layout, Menu, Breadcrumb, message, Progress, Divider, Icon, Row, Col, Collapse, Statistic, Card, Button } from 'antd';
import * as Api from './MainService';
import './Main.css'
import Config from '../Config';
const { Header, Content, Footer } = Layout;
const { Panel } = Collapse;
const ButtonGroup = Button.Group;
interface IProps {

}
interface IState {
    apiData: any;
    preApiData: any;
    zoomLevel: number;
}
interface IZoomStyle {
    defaultFontSize: number;
    activeMonsterFontSize: number;
    activeTeamIconSize: number;
    defaultProgressWidth: number;
    activeProgressWidth: number;
    teamHeight: number;
    seHeight: number;
}

let PlayerDPS = new Map<string, number>();

function getMinutes(seconds: number) {
    return Math.floor(seconds / 60);
}

function getSeconds(seconds: number) {
    var minutes = getMinutes(seconds);
    var answer = seconds - 60 * minutes;
    if (answer < 10) {
        return "0" + answer;
    }
    return answer;
}

// TODO:
// Reset timers on quest complete (Done?)
// Fix percents on player damage (calculation and rounding) (Done?)
// Fix rounding on monster health (Done?)
// Add numbers to monster parts
// Add quest timer (Done?)
// Add more columns to status effects (buffs, mantles, debuffs)
// Add DPS
// Clear status effects on death (Done?)
// Subtract 2 seconds from quest timer on quest complete
// Add scrollbar to console window
// Add option to automatically open browser window on start
// Add option to automatically open game on start


export default class Main extends React.Component<IProps, IState>{
    Interval: NodeJS.Timeout | undefined;
    SEInterval: NodeJS.Timeout | undefined;
    activeMonsterIndex: number;
    zoomStyle: Array<IZoomStyle>;
    lastUpdateTime: number;
    isInQuest: boolean;
    currentlyActiveStatusEffects: string[];
    questStartTime: number;
    secondsElapsed: number;
    constructor(props: IProps) {
        super(props);
        this.state = {
            apiData: {},
            preApiData: {},
            zoomLevel: 1
        }
        this.activeMonsterIndex = 0;
        // Tracks the last time data was pushed successfully from Smart Hunter
        this.lastUpdateTime = 0;
        this.isInQuest = false;
        // Keeps track of whether or not React Hunter is currently showing any active status effects
        this.currentlyActiveStatusEffects = [];
        this.questStartTime = 0;
        this.secondsElapsed = 0;
        this.zoomStyle = [
            {
                defaultFontSize: 10,
                activeMonsterFontSize: 16,
                activeTeamIconSize: 14,
                defaultProgressWidth: 8,
                activeProgressWidth: 8,
                teamHeight: 50,
                seHeight: 25
            },
            {
                defaultFontSize: 14,
                activeMonsterFontSize: 20,
                activeTeamIconSize: 18,
                defaultProgressWidth: 10,
                activeProgressWidth: 10,
                teamHeight: 60,
                seHeight: 30
            },
            {
                defaultFontSize: 18,
                activeMonsterFontSize: 26,
                activeTeamIconSize: 22,
                defaultProgressWidth: 12,
                activeProgressWidth: 12,
                teamHeight: 70,
                seHeight: 35
            },
            {
                defaultFontSize: 22,
                activeMonsterFontSize: 30,
                activeTeamIconSize: 26,
                defaultProgressWidth: 16,
                activeProgressWidth: 16,
                teamHeight: 80,
                seHeight: 40
            },
            {
                defaultFontSize: 26,
                activeMonsterFontSize: 36,
                activeTeamIconSize: 30,
                defaultProgressWidth: 20,
                activeProgressWidth: 20,
                teamHeight: 90,
                seHeight: 45
            }
        ];
    }

    componentDidMount() {
        this.Interval = setInterval(() => {
            this.doInterval();
        }, 500);
        this.SEInterval = setInterval(() => {
            this.doSEInterval();
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.Interval!);
        clearInterval(this.SEInterval!);
    }

    doInterval = async () => {
        let _r = await Api.GetData();
        let r = _r;

        if (!Config.fakeApi) {
            var find = "NaN";
            var re = new RegExp(find, 'g');

            try {
                _r = _r.replace(re, "0");
                this.lastUpdateTime = Date.now();
            } catch (TypeError) {
                return;
            }

            r = JSON.parse(_r);
        }

        if (r.isSuccess) {
            this.setState({
                apiData: r.data,
                preApiData: this.state.apiData
            })
        }
        //else {
        //    message.error({
        //        content: "Data Get Failure!"
        //    })
        //}
		
    }

    doSEInterval = async () => {
        var currentTime = Date.now();
        if ((currentTime - this.lastUpdateTime) / 1000 > 1) {
            // More than 1 second has elapsed (i.e. more than 2 rerenders or "API updates") since the last time lastUpdateTime was updated so we assume the player is not in a quest
            // Therefore, we reset state for timers and status effects
            this.isInQuest = false;
            this.lastUpdateTime = 0;
            if (this.currentlyActiveStatusEffects.length !== 0) {
                this.currentlyActiveStatusEffects = [];
                // Player has left the quest but they still have active status effects so we need to force a rerender by setting the state to reset the timers
                this.setState({
                    apiData: this.state.apiData,
                    preApiData: this.state.preApiData
                })
            }
            if (this.questStartTime !== 0) {
                this.questStartTime = 0;
                this.secondsElapsed = 0;
            }
        } else {
            if (this.questStartTime === 0) {
                this.questStartTime = Date.now();
            } else {
                this.secondsElapsed = Math.round((Date.now() - this.questStartTime) / 1000);
            }
            this.isInQuest = true;
        }
    }

    getStyle = () => {
        return this.zoomStyle[this.state.zoomLevel];
    }

    render() {
        const MonsterBarColor = '#108ee9';
        const TeamDamageBarColor = '#FF0000';
        let getMonsterEffect = (data: any) => {
            if (!data) {
                return null
            }
            return data.map((ef: any, index: number) => {
                if (ef.isVisible) {
                    return (
                        <Card.Grid key={index} style={{ padding: 5 }}>
                            <div>{ef.name}</div>
                            <Progress strokeColor="rgb(255, 157, 255)" percent={ef.buildup.fraction * 100} showInfo={false} />
                            <Progress strokeColor="#8fa7ff" percent={ef.duration.fraction * 100} showInfo={false} />
                        </Card.Grid>);
                }
                else {
                    return null;
                }
            });
        }

        let getMonsterCrown = (data: any) => {
            if (data.crown == 2) {
                return (<Icon type="trophy" theme="twoTone" twoToneColor="darkgray" />)
            }
            else if (data.crown == 3) {
                return (<Icon type="trophy" theme="twoTone" twoToneColor="darkgoldenrod" />)
            }
            else if (data.crown == 1) {
                return (<Icon type="smile" theme="twoTone" twoToneColor="darkgoldenrod" />)
            }
        }

        let getMonsters = () => {
            if (!this.state.apiData || !this.state.apiData.monsters) {
                return null;
            }
            var data = this.state.apiData.monsters as Array<any>;
            var preData = this.state.preApiData.monsters as Array<any>;
            var _temphp = 2;
            //var _tempIndex = 0;
            //获得当前正在讨伐的怪物
            if (preData?.length == data?.length &&
                preData.every((v: any, i: number) => data[i].name == v.name)) {
                var _t = 0;
                preData.forEach((item: any, index: number) => {
                    var _t2 = item.health.fraction - data[index].health.fraction;
                    if (_t2 > _t) {
                        _t = _t2;
                        this.activeMonsterIndex = index;
                    }
                });
            }
            else {
                data.forEach((m: any, index: number) => {
                    if (m.health.fraction < _temphp && m.health.fraction > 0) {
                        _temphp = m.health.fraction;
                        this.activeMonsterIndex = index;
                    }
                });
            }
            var monsterRender = data.map((m: any, index: number) => {
                let fontStyle: any = {
                    fontWeight: "bold",
                    fontSize: this.getStyle().defaultFontSize
                }
                if (index == this.activeMonsterIndex) {
                    fontStyle.fontSize = this.getStyle().activeMonsterFontSize;
                }
                return (
                    <Panel showArrow={false} key={String(index)} header={(
                        <div style={{ height: index == this.activeMonsterIndex ? this.getStyle().teamHeight - 20 : this.getStyle().teamHeight - 25 }}>
                            <div style={{ display: "flex" }}>
                                <span style={fontStyle}>{m.name} ({Math.round(m.health.current)}/{m.health.max})  {getMonsterCrown(m)}</span>
                                <div style={{ flexGrow: 1, textAlign: "right" }}>
                                    <span style={{ color: "white", fontWeight: "bold", fontSize: this.getStyle().defaultFontSize }}>{Math.round(m.health.fraction * 100)}%</span>
                                </div>

                            </div>
                            <Progress
                                strokeWidth={index == this.activeMonsterIndex ? this.getStyle().activeProgressWidth : this.getStyle().defaultProgressWidth}
                                status="active"
                                strokeColor={index == this.activeMonsterIndex ? "#FF0000" : MonsterBarColor}
                                percent={m.health.fraction * 100}
                                showInfo={false}
                            />
                        </div>
                    )}>
                        <Row>
                            <Col span={24}>{getMonsterEffect(m.statusEffects)}</Col>
                            <Col span={24} style={{ height: 10 }}></Col>
                            {m.parts.map((p: any) => {
                                return (
                                    <Col key={m.address + p.name} span={6} style={{ textAlign: "center" }}>
                                        <div>{p.name}</div>
                                        <Progress
                                            type="circle"
                                            percent={p.health.fraction * 100}
                                            width={65}
                                            format={percent => (<span style={{ color: "white" }}>{Math.floor(p.health.fraction * 100)}%</span>)}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                        <div style={{ height: "10px" }}></div>
                    </Panel>
                )
            });
            return (
                <div> 
                <span style={{ color: "white", fontWeight: "bold", fontSize: "20px", position: "relative", zIndex: 9999 }}>
                {"Quest timer: " + ((this.secondsElapsed === 0) ? "00:00" : getMinutes(this.secondsElapsed) + ":" + getSeconds(this.secondsElapsed))}
                </span>
                <Collapse accordion activeKey={String(this.activeMonsterIndex)}>
                    {monsterRender}
                </Collapse>
                </div>
            )
        }

        let getTeam = () => {
            if (!this.state.apiData || !this.state.apiData.players) {
                return null;
            }
            var data = this.state.apiData.players;
            var teamDamage = 0;
            var _tempDamage = 0;
            var _tempIndex = 0;
            data.forEach((m: any, index: number) => {
                if (m.damage > _tempDamage) {
                    _tempDamage = m.damage;
                    _tempIndex = index;
                }

                //PlayerDPS.set(m.name, m.damage);
            });
            data.forEach((p: any, index: number) => {
                teamDamage += p.damage;
            });
            return data.map((p: any, index: number) => {
                if (p.name == "未知玩家") { 
                    return null;
                }
                else {
                    return (
                        <div key={p.name} style={{ height: this.getStyle().teamHeight }}>
                            <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ fontWeight: "bold", fontSize: this.getStyle().defaultFontSize }}>{p.name} {p.damage} { }</span>
                                    {index == _tempIndex ? (<Icon style={{ color: "red", marginLeft: 10, fontSize: this.getStyle().activeTeamIconSize }} type="chrome" spin={true} />) : null}
                                </div>
                                <div style={{ flexGrow: 1, textAlign: "right" }}>
                                    <span style={{ color: "white", fontWeight: "bold", fontSize: this.getStyle().defaultFontSize }}>{teamDamage === 0 ? 0 : Math.round((p.damage / teamDamage) * 100)}%</span>
                                </div>
                            </div>
                            <Progress
                                strokeWidth={this.getStyle().defaultProgressWidth}
                                strokeColor={MonsterBarColor}
                                percent={teamDamage === 0 ? 0 : (p.damage / teamDamage) * 100}
                                showInfo={false}
                            />
                        </div>
                    )
                }
			});
        }

        let getPlayer = () => {
            if (!this.state.apiData || !this.state.apiData.player) {
                return null;
            }
            var data = this.state.apiData.player;
            //StatusEffects = new Map<string, number>();
            //data.forEach((se: any, index: number) => {
            //    if (se.time !== null) {
            //        StatusEffects.set(se.name, se.time.current);
            //    }
            //});
            return data.map((se: any, index: number) => {
                if (!this.isInQuest) return null;
                if (!se.isVisible) {
                    if (this.currentlyActiveStatusEffects.includes(se.name)) this.currentlyActiveStatusEffects.splice(this.currentlyActiveStatusEffects.indexOf(se.name), 1);
                    return null;
                } else {
                    this.currentlyActiveStatusEffects.push(se.name);
                }
                // To handle status effects like Mega Demondrug
                if (se.time === null) {
                    return (
                        <div key={se.name} style={{ height: this.getStyle().seHeight }}>
                            <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ fontWeight: "bold", fontSize: this.getStyle().defaultFontSize }}>{se.name}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
                else if (Math.round(se.time.current) <= 1) {
                    if (this.currentlyActiveStatusEffects.includes(se.name)) this.currentlyActiveStatusEffects.splice(this.currentlyActiveStatusEffects.indexOf(se.name), 1);
                    return null;
                } 
                else if (se.groupId === "Debuff") {
                    return (
                        <div key={se.name} style={{ height: this.getStyle().seHeight }}>
                           <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ color: "red", fontWeight: "bold", fontSize: this.getStyle().defaultFontSize }}>{se.name + " " + ((this.isInQuest) ? getMinutes(Math.round(se.time.current)) + ":" + getSeconds(Math.round(se.time.current)) : "00:00")}</span>
                               </div>
                            </div>
                       </div>
                    )
                }
                else {
                    return (
                        <div key={se.name} style={{ height: this.getStyle().seHeight }}>
                            <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ color: "white", fontWeight: "bold", fontSize: this.getStyle().defaultFontSize }}>{se.name + " " + ((this.isInQuest) ? getMinutes(Math.round(se.time.current)) + ":" + getSeconds(Math.round(se.time.current)) : "00:00")}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            });
        }

        let defaultFont = {
            fontSize: 10
        }

        let onZoomChange = (isZoomIn: boolean) => {
            if (isZoomIn) {
                if (this.state.zoomLevel >= this.zoomStyle.length - 1) {
                    return;
                }
                this.setState({
                    zoomLevel: this.state.zoomLevel + 1
                })
            }
            else {
                if (this.state.zoomLevel <= 0) {
                    return;
                }
                this.setState({
                    zoomLevel: this.state.zoomLevel - 1
                })
            }
        }
        return (
            <Layout className="layout" style={{ height: "100vh", color: "rgb(255, 255, 255)", background: "rgb(51, 51, 51) none repeat scroll 0% 0%" }}>
                <Content style={{ padding: '10px', height: "100%" }}>
                    <div style={{ color: "rgb(255, 255, 255)", background: "rgb(51, 51, 51) none repeat scroll 0% 0%", padding: 10, minHeight: "100%" }}>
                        <div style={{ color: "white", fontWeight: "bold", fontSize: "20px", position: "absolute", margin: "0px 10px", zIndex:9999 }}>
                            React Hunter
                            <ButtonGroup style={{ marginLeft: 20, zIndex: 9999 }}>
                                <Button type="primary" icon="zoom-in" onClick={e => { onZoomChange(true) }} />
                                <Button type="primary" icon="zoom-out" onClick={e => { onZoomChange(false) }} />
                            </ButtonGroup>
                        </div>
                        <Row>
                            <Col lg={12} style={{ padding: 10 }}>
                                <Divider orientation="right" style={{ color: 'white' }}>Monster</Divider>
                                <div>

                                    {getMonsters()}
                                </div>
                            </Col>
                            <Col lg={12} style={{ padding: 10 }}>
                                <Divider orientation="right" style={{ color: 'white' }}>Team Damage</Divider>
                                <div>
                                    {getTeam()}
                                </div>
                                <Divider orientation="right" style={{ color: 'white' }}>Status Effects</Divider>
                                <div>
                                    {getPlayer()}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} style={{ padding: 10 }}></Col>
                            <Col lg={12} style={{ padding: 10 }}>
                                
                            </Col>
                        </Row>
                    </div>
                </Content>
            </Layout>
        );
    }
}