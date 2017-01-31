import React from 'react';


export default ({element:{currentBounds:{top, left, width, height}, active, color}}) => {
    let style = {
        width: width + '%',
        height: height + '%',
        position: 'absolute',
        top: top + "%",
        left: left + "%",
        display: active ? 'block' : 'none',
        backgroundColor: color ? color : 'white'
    };
    return (
        <div style={style}>
        </div>
    )
}