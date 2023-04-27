import React, { useState } from "react";
import "./Topbar.css";
import { NotificationsNone, Language, Settings } from "@mui/icons-material";
import Logo3 from "../../components/topbar/Logo3.jpeg";
import { Menu, MenuItem } from "@mui/material";
import ob from "./OB.png"

export default function Topbar() {
	const [open, setOpen] = useState(false);
	// const [menuOpen, setMenuOpen] = useState(false);
	// className={"menu " + (menuOpen && active)}

	return (
		<div className="topbar">
			<div className="topbarWrapper">
				<div className="topleft">
					<img src={Logo3} alt="" className="logo" />
					<div className="text">
						<h2 className="h2">powered by</h2>
						<div className="ig">
							<img
								src={ob}
								className="imgOrange"
								alt=""
							/>
						</div>
					</div>
				</div>
				{/* <div className='topMiddle'>
        <div className="drop">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/800px-Orange_logo.svg.png" alt=""/>
        </div>
        </div> */}
				<div className="topRight">
					<div className="topbarIconContainer">
						<NotificationsNone />
						<span className="topIconBadge">2</span>
					</div>
					<div className="topbarIconContainer">
						<Language />
						<span className="topIconBadge">2</span>
					</div>
					<div className="topbarIconContainer">
						<Settings onClick={() => setOpen(true)} className="setting do" />
						<Menu
							className="menu"
							id="demo-positioned-menu"
							aria-labelledby="demo-positioned-button"
							open={open}
							onClose={() => setOpen(false)}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
						>
							<MenuItem>Profile</MenuItem>
							<MenuItem>My account</MenuItem>
							<MenuItem>Logout</MenuItem>
						</Menu>
					</div>

					<img
						src="https://c4.wallpaperflare.com/wallpaper/246/739/689/digital-digital-art-artwork-illustration-abstract-hd-wallpaper-preview.jpg"
						alt=""
						className="TopAvatar"
					/>
				</div>
			</div>
		</div>
	);
}
