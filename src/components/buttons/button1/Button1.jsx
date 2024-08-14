import React from "react";
import "./button.css";

const Button = (props) => {
	return (
		<div className="buttonCon1">
			<button className="Button1">{props.name}</button>
		</div>
	);
};

export default Button;
