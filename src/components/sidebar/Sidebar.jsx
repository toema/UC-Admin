import React from "react";
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
} from "@mui/icons-material";
export default function Sidebar() {
	const navigate = useNavigate();
	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Dashboard</h3>
					<ul className="sidebarList">
						<li className="sidebarListItem " onClick={() => navigate(`/`)}>
							<AddBusinessRounded className="SidebarIcon" />
							<span className="sp">All Services</span>
						</li>{" "}
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
					<h3 className="sidebarTitle">Quick Features</h3>
					<ul className="sidebarList">
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
					<h3 className="sidebarTitle">Manage Departments</h3>
					<ul className="sidebarList">
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
					<h3 className="sidebarTitle">Statistics</h3>
					<ul className="sidebarList">
						<li className="sidebarListItem ">
							<Forum className="SidebarIcon" />

							<span className="sp">Feedback</span>
						</li>{" "}
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
	);
}
