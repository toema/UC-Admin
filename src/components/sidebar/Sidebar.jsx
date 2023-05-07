import React, { useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import {
	Timeline,
	TrendingUp,
	ConnectWithoutContactRounded,
	AccountTreeRounded,
	HomeWorkRounded,
	EmojiObjects,
	Forum,
	Groups,
	AddBusinessRounded,
	DesignServicesRounded,
	TvRounded,
	NavigateNext,
} from "@mui/icons-material";
import Logo3 from "../sidebar/Logo3.jpeg";
import ob from "./OB.png";

export default function Sidebar() {
	const navigate = useNavigate();

	const [toggle, setToggle] = useState(false);
	const [admin, setAdmin] = useState(true);
	const [open, setOpen] = useState(true);
	const [moh, setMoh] = useState(true);

	return (
		<div className="sidebar">
			<div className="sidebar222">
				<div className="container-text-logo">
					<div className="imgLogo">
						<img src={Logo3} alt="logo3" className="logo3" />
					</div>
					<div className="text">
						<h2 className="h2">powered by</h2>
						<div className="ig">
							<img src={ob} className="imgOrange" alt="" />
						</div>
					</div>
				</div>
				<div className="sidebarWrapper">
					<div className="div2">
						<div className="sidebarMenu">
							<h3
								className={"sidebarTitle1 " + (toggle && "active")}
								onClick={() => setToggle(!toggle)}
							>
								Dashboard
								<NavigateNext
									onClick={() => setToggle(!toggle)}
									className={"arrowIcon1 " + (toggle && "active")}
								/>
							</h3>
							<ul className={"sidebarList1 " + (toggle && "active")}>
								<li className="sidebarListItem" onClick={() => navigate(`/`)}>
									<AddBusinessRounded className="SidebarIcon" />
									<span className="sp">All Services</span>
								</li>
								<li className="sidebarListItem">
									<Groups className="SidebarIcon" />
									<span className="sp">Users</span>
								</li>
								<li className="sidebarListItem">
									<TvRounded className="SidebarIcon" />
									<span className="sp">Devices</span>
								</li>
							</ul>
						</div>
						<div className="sidebarMenu">
							<h3
								className={"sidebarTitle2 " + (admin && "uc")}
								onClick={() => setAdmin(!admin)}
							>
								Quick Features
								<NavigateNext
									onClick={() => setAdmin(!admin)}
									className={"arrowIcon2 " + (admin && "uc")}
								/>
							</h3>
							<ul className={"sidebarList2 " + (admin && "uc")}>
								<li className="sidebarListItem ">
									<EmojiObjects className="SidebarIcon" />
									<span className="sp">Manage BLF</span>
								</li>{" "}
								<li className="sidebarListItem">
									<Groups className="SidebarIcon" />

									<span className="sp">Groups</span>
								</li>
								<li className="sidebarListItem">
									<DesignServicesRounded className="SidebarIcon" />
									<span className="sp">Advanced Services</span>
								</li>
							</ul>
						</div>
						<div className="sidebarMenu">
							<h3
								className={"sidebarTitle3 " + (open && "seif")}
								onClick={() => setOpen(!open)}
							>
								Manage Departments
								<NavigateNext
									onClick={() => setOpen(!open)}
									className={"arrowIcon3 " + (open && "seif")}
								/>
							</h3>
							<ul className={"sidebarList3 " + (open && "seif")}>
								<li className="sidebarListItem ">
									<HomeWorkRounded className="SidebarIcon" />

									<span className="sp">Departments</span>
								</li>{" "}
								<li className="sidebarListItem">
									<AccountTreeRounded className="SidebarIcon" />

									<span className="sp">Access provision</span>
								</li>
								<li className="sidebarListItem">
									<ConnectWithoutContactRounded className="SidebarIcon" />

									<span className="sp">Contact Center</span>
								</li>
							</ul>
						</div>
						<div className="sidebarMenu">
							<h3
								className={"sidebarTitle4 " + (moh && "mah")}
								onClick={() => setMoh(!moh)}
							>
								Statistics
								<NavigateNext
									onClick={() => setMoh(!moh)}
									className={"arrowIcon4 " + (moh && "mah")}
								/>
							</h3>
							<ul className={"sidebarList4 " + (moh && "mah")}>
								<li className="sidebarListItem ">
									<Forum className="SidebarIcon" />

									<span className="sp">Feedback</span>
								</li>
								<li className="sidebarListItem">
									<Timeline className="SidebarIcon" />
									<span className="sp">Analytics</span>
								</li>
								<li className="sidebarListItem">
									<TrendingUp className="SidebarIcon" />

									<span className="sp">Tickets</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
