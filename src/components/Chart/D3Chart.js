import React, { useState, useEffect } from "react";
import ZoomableLineChart from "./D3LineChart";
import { Panel } from "components/UI"
import styled from 'styled-components'
import { borderRadius } from 'context/responsive/cssSizes'
import { useSwap } from 'context/SwapContext'

const ChartWrapper = styled.div`
    height: 100%;
    min-width: 30rem;
    max-width: 50rem;
    flex-basis: auto; /* default value */
    flex-grow: 1;
`

const a = 100000000

function SupplyToEth(supply) {
    return (supply/a)**2
}

function supplyToArray(supBegin, supEnd) {
    var dataArray = []
    const dif = supEnd - supBegin
    const n = 100
    for (var i = 0; i < n; i++) {
        dataArray.push(
            { 
                x: supBegin + dif*i/n,
                y: SupplyToEth(supBegin + dif*i/n)
            }
        );
    }
    return dataArray
}

const ChartHeader = styled.header`
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 1rem;
  height: 3rem;
  line-height: 3rem;
  background: ${props => props.theme.colors.headerBackground};
  text-align: center;
  vertical-align: middle;
  border-radius: ${borderRadius};
`

export default function D3Chart() {
    const buffer = 1000000
    
    const { swapSupply } = useSwap()
    var upperBound = 100000000
    var lowerBound = 0
    
    const [data, setData] = useState(supplyToArray(lowerBound, upperBound))
    const [areaData, setAreaData] = useState(supplyToArray(lowerBound, upperBound))

    useEffect(() => {
        if (swapSupply[1]) {
            console.log(swapSupply)
            console.log(swapSupply[0])
            const lowerBoundExp = Math.round(swapSupply[0]/1000000)
            if (lowerBoundExp == 0) {
                lowerBound = 0
            } else {
                lowerBound = (Math.round(swapSupply[0]/1000000) - 1)*buffer
            }
            upperBound = (Math.round(swapSupply[1]/1000000) + 1)*buffer
            setData(supplyToArray(lowerBound, upperBound))
            setAreaData(supplyToArray(swapSupply[0], swapSupply[1]))
        }
    },[swapSupply])
    
    
    
    return (
        <ChartWrapper>
            <Panel>
                <ChartHeader>
                    Bonding Curve
                </ChartHeader>
                <ZoomableLineChart data={data} areaData={areaData} />
            </Panel>
        </ChartWrapper>
    )
}