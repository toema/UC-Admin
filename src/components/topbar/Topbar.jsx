import React, { useEffect, useState } from "react";
import "./Topbar.css";
import { NotificationsNone, Language, Settings } from "@mui/icons-material";
// import Logo3 from "../../components/topbar/Logo3.jpeg";
import { Menu, MenuItem } from "@mui/material";
import ob from "./OB.png";

export default function Topbar() {
	const [open, setOpen] = useState(false);
	// start timer
	const [hours, setHours] = useState(0);
	const [secounds, setSecounds] = useState(0);
	const [minutes, setMinutes] = useState(0);

	var timer;
	useEffect(() => {
		timer = setInterval(() => {
			setSecounds(secounds + 1);
			if (minutes === 59) {
				setHours(hours + 1);
			}
			if (secounds === 59) {
				setMinutes(minutes + 1);
				setSecounds(0);
			}
		}, 1000);
		return () => clearInterval(timer);
	});

	// end timer

	return (
		<div className="topbar">
			<div className="topbarWrapper">
				<div className="contain">
					<div className="topRight">
						<div className="timer">
							<h1>
								{hours < 10 ? "0" + hours : hours}:
								{minutes < 10 ? "0" + minutes : minutes}:
								{secounds < 10 ? "0" + secounds : secounds}
							</h1>
						</div>
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
		</div>
	);
}
