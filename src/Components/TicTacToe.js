import React, { Component } from 'react'
import './TicTacToe.css'
const _ = require('lodash');


const boardSize = 3;
const checkForWinner = (playload) => {
    const {
        boardSize,
        targetId: updatedCell,
        targetValue: updatedValue,
        tableArray: tableData,
        player,
    } = playload
    const [updatedRow, updatedCol] = updatedCell.split('*')

    // check for the row values
    // remove the keys whhich matches the updatedValue from the updated row
    const rowMatched = _.isEmpty(_.omitBy(tableData[updatedRow], (value) => { return value === updatedValue }));
    if(rowMatched){
        console.log("player ===> ", player)
        return player;
    }

    let updatedColRangeValues = []
    let updatedDiagonalRangeValues = []
    let updatedAntiDiagonalRangeValues = []
    let rowCounter = 0
    let colCounter = 0

    tableData.forEach(row => {

        // check for the matching col values
        row[`${rowCounter}*${updatedCol}`] === updatedValue && updatedColRangeValues.push(row[`${rowCounter}*${updatedCol}`]);

        // check for the matching diagonal values
        row[`${rowCounter}*${colCounter}`] === updatedValue && updatedDiagonalRangeValues.push(row[`${rowCounter}*${colCounter}`]);

        rowCounter++
        colCounter++

    });
    if(updatedColRangeValues.length === boardSize){
        return player
    }
    console.log(updatedDiagonalRangeValues)
    console.log(" =====> ", JSON.stringify(tableData))
    
    return false;
}

export default class TicTacToe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllCellfilled: false,
            tableArray: this.createtableArray(boardSize),
            player1: true,
            player2: false,
            winner: false,
        };
    }

    /**
     * This basically creates N * N array of objects 
     * @param {INTERGER} size 
     * @returns {ARRAY}
     */
    createtableArray = (size) => {
        const cellArray = []
        for(var row=0; row<size; row++){
            const cellObj = {}
            for(var col=0; col<size; col++){
                cellObj[`${row}*${col}`] = ""
            }
            cellArray.push(cellObj)
        }
        return cellArray;
    }

    createTable = (dataArray) => {
        return (
            <table className="table">
                <tbody>
                    {dataArray.map((rowData, index) => {
                        return this.createRows(rowData, index)
                    })}
                </tbody>
            </table>
        )
    }

    createRows = (rowObj, rowId) => {
        return (
            // rowId + 1 because the array starts from 0
            <tr id={rowId}>
                {
                    // eslint-disable-next-line
                    Object.keys(rowObj).map(element => {
                        return <td id={element} className="cell" onChange={this.validateCellVal}>
                            <input id={element} className="cell_input" value={rowObj[element]}></input>
                        </td>
                    })
                }
            </tr>
        )
    }

    getMessage = () => {
        const {isAllCellfilled, winner} = this.state;
        if(isAllCellfilled || winner){
            return (
            <div>
                <h2>Game Over </h2>
                <h1>{winner ? `${winner} wins` : "It's Draw"}</h1>
            </div>)
        }
        return  <h4 style={{ color: 'black'}}>{this.state.player1 ? "player 1" : "player 2"} 's Move </h4>
    }

    validateCellVal = (data) => {
        const { tableArray, player1, player2 } = this.state;
        const targetValue = data.target.value.toLowerCase();
        const targetId = data.target.id
        console.log(targetId)
        let emptycells = {}
        if((player1 && targetValue === 'x') || (player2 && targetValue === 'o')){
            // Logic for updating the cell value
            tableArray.forEach(row => {
                if(row[targetId] === "") {
                    row[targetId] = targetValue;
                }
                emptycells = {
                    ...emptycells,
                    ..._.pickBy(row, (keyValue) => {
                        return keyValue === ""
                    })
                }
                
            });
            const winner = Object.keys(emptycells).length <= 6 ? checkForWinner({
                boardSize,
                targetId,
                targetValue,
                tableArray,
                player: player1 ? "player1" : "player2",
            }) : false;

            // console.log("winnner :::", winner)

            // checkForWinner({ 
            //     targetId,
            //     targetValue,
            //     tableArray,
            //     player: player1 ? player1 : player2,
            // })

            this.setState({
                isAllCellfilled: Object.keys(emptycells).length === 0,
                tableArray, 
                player1: !player1,
                player2: !player2,
                winner
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
