import React, { Component } from 'react'
import './TicTacToe.css'
const _ = require('lodash');

export default class TicTacToe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllCellfilled: false,
            tableArray: this.createtableArray(3),
            player1: true,
            player2: false
        };
    }

    /**
     * This basically creates N * N array of objects 
     * @param {INTERGER} size 
     * @returns {ARRAY}
     */
    createtableArray = (size) => {
        const cellArray = []
        for(var row=1; row<=size; row++){
            const cellObj = {
                trID: `${row}`
            }
            for(var col=1; col<=size; col++){
                // cellObj[`${row} * ${col}`] = {
                //     id: `${row} * ${col}`,
                //     onChange: this.validateCellVal,
                //     value: ""
                // }
                cellObj[`${row} * ${col}`] = ""
            }
            cellArray.push(cellObj)
        }
        return cellArray;
    }

    createTable = (dataArray) => {
        return (
            <table className="table">
                <tbody>
                    {dataArray.map((rowData) => {
                        return this.createRows(rowData)
                    })}
                </tbody>
            </table>
        )
    }

    createRows = (rowObj) => {
        return (
            <tr id={rowObj.trID}>
                {
                    Object.keys(rowObj).map(element => {
                        if(element !== 'trID'){
                            return <td id={element} className="cell" onChange={this.validateCellVal}>
                                <input id={element} className="cell_input" value={rowObj[element]}></input>
                            </td>
                        }
                    })
                }
            </tr>
        )
    }

    getMessage = () => {
        const {isAllCellfilled} = this.state;
        if(isAllCellfilled){
            return <h2>Game Over</h2>
        }
        return  <h4 style={{ color: 'black'}}>{this.state.player1 ? "player 1" : "player 2"} 's Move </h4>
    }

    validateCellVal = (data) => {
        const { tableArray, player1, player2 } = this.state;
        const targetValue = data.target.value.toLowerCase();
        const targetId = data.target.id
        console.log(targetId)
        let emptycells = []
        if(targetValue === 'x' || targetValue === 'o'){
            tableArray.forEach(row => {
                if(row[targetId] || row[targetId] === "") {
                    row[targetId] = targetValue.toUpperCase();
                }
                const emptycellObj = _.pickBy(row, (keyValue) => {
                    return keyValue === ""
                })
                !_.isEmpty(emptycellObj) && emptycells.push(emptycellObj)
            });

            this.setState({
                isAllCellfilled: emptycells.length === 0,
                tableArray, 
                player1: !player1,
                player2: !player2,
            })
        }
        // Need to thor error here 
        return true
    }

    newGame = () => {
        console.log("button clicked")
        window.location.reload(true);
    }

    render() {
        return (
            <div className="outerDiv">
                <div className="button_div">
                    <button onClick={this.newGame}>New Game</button>
                </div>
                <div className="table_div">
                    {this.createTable(this.state.tableArray)}
                </div>
                <div className="footer_div">
                    <h3 style={{ color: `${this.state.player1 ? 'green': 'red'}`}}> Player 1</h3>
                    {this.getMessage()}
                    <h3 style={{ color: `${this.state.player2 ? 'green': 'red'}`}}> Player 2</h3>
                </div>
            </div>
        )
    }
}
