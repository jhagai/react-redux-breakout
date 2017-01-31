import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux'
import AppStore from './redux/AppStore'
import Square from './app/components/Square'


class App extends Component {

    componentDidMount() {
        console.log("componentDidMount");

        var keys = {left: false, right: false};

        setInterval(() => {
            AppStore.dispatch(
                {
                    type: 'ITERATION',
                    payload: {
                        keys: keys
                    }
                }
            );
        }, 10);

        document.onkeydown = (e) => {
            if (e.keyCode === 37) {
                keys.left = true;

            } else if (e.keyCode === 39) {
                keys.right = true;
            }
        };

        document.onkeyup = (e) => {
            if (e.keyCode === 37) {
                keys.left = false
            } else if (e.keyCode === 39) {
                keys.right = false;
            }
        };

        document.onkeypress = (e) => {
            if (e.keyCode === 32) {
                AppStore.dispatch(
                    {
                        type: 'COMMAND',
                        payload: 'SPACE'
                    }
                );
            }
        };
    }

    render() {

        let index = 0;
        let bricks = this.props.bricks.map(
            (brick) => {
                return <Square element={brick} key={index++}/>
            }
        );

        return (
            <div style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
                <Square element={this.props.bar}/>
                <Square element={this.props.ball}/>
                {bricks}
            </div>
        );
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        clearInterval(this.interval);
    }
}

const mapStateToProps = (state) => {
    return {
        counter: state.counter,
        bar: state.bar,
        ball: state.ball,
        bricks: state.bricks
    }
}


export default connect(
    mapStateToProps
)(App)