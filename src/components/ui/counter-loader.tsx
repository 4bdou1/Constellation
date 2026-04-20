"use client";
import React from "react";
import styled from "styled-components";

// translateX (px) per digit for each animated block:
// indices → [div1, div2, div4, div6, div7, div8, div10, div12, div13, div14]
// derived from the original CSS keyframes (each 10% stage = one digit, 0%→0, 10%→1, …)
const DIGIT_POS: Record<number, number[]> = {
  0: [  0,  0,  0,   0,  0, 35,   0,   0,  0,  0],
  1: [ 70, 35, 70,   0, 70, 35,  70,   0, 70, 35],
  2: [  0,  0, 70,   0,  0,  0,   0, -70,  0,  0],
  3: [  0,  0, 70,   0,  0,  0,  70,   0,  0,  0],
  4: [  0, 35,  0,   0,  0,  0,  70,   0, 70, 35],
  5: [  0,  0,  0, -70,  0,  0,  70,   0,  0,  0],
  6: [  0,  0,  0, -70,  0,  0,   0,   0,  0,  0],
  7: [  0,  0, 70,   0, 70, 35,  70,   0, 70, 35],
  8: [  0,  0,  0,   0,  0,  0,   0,   0,  0,  0],
  9: [  0,  0,  0,   0,  0,  0,  70,   0,  0,  0],
};

function DigitGrid({ digit }: { digit: number }) {
  const p = DIGIT_POS[digit] ?? DIGIT_POS[0];
  const tx = (i: number) => ({ transform: `translateX(${p[i]}px)` });

  return (
    <div className="timer">
      <div id="div1"  style={tx(0)} />
      <div id="div2"  style={tx(1)} />
      <div id="div3" />
      <div id="div4"  style={tx(2)} />
      <div id="div5" />
      <div id="div6"  style={tx(3)} />
      <div id="div7"  style={tx(4)} />
      <div id="div8"  style={tx(5)} />
      <div id="div9" />
      <div id="div10" style={tx(6)} />
      <div id="div11" />
      <div id="div12" style={tx(7)} />
      <div id="div13" style={tx(8)} />
      <div id="div14" style={tx(9)} />
      <div id="div15" />
    </div>
  );
}

interface CounterLoadingProps {
  count: number;
}

const CounterLoading = ({ count }: CounterLoadingProps) => {
  const showTens = count >= 10;
  const tensDigit = Math.floor(count / 10);
  const unitsDigit = count % 10;

  return (
    <StyledWrapper>
      <div className="digits-row">
        <div className="tens-wrap" style={{ opacity: showTens ? 1 : 0 }}>
          <DigitGrid digit={tensDigit} />
        </div>
        <DigitGrid digit={unitsDigit} />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;

  .digits-row {
    display: flex;
    gap: 30px;
    align-items: center;
  }

  .tens-wrap {
    transition: opacity 0.5s ease;
  }

  .timer {
    display: grid;
    grid-template-columns: repeat(3, 25px);
    grid-template-rows: repeat(5, 25px);
    gap: 10px;
    grid-template-areas:
      "div1  div2  div3"
      "div4  div5  div6"
      "div7  div8  div9"
      "div10 div11 div12"
      "div13 div14 div15";
  }

  .timer > div {
    grid-area: attr(id);
    background-color: #ffd89b;
    border-radius: 5px;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }

  #div1  { grid-area: div1; }
  #div2  { grid-area: div2; }
  #div3  { grid-area: div3; }
  #div4  { grid-area: div4; }
  #div5  { grid-area: div5; display: none; }
  #div6  { grid-area: div6; }
  #div7  { grid-area: div7; }
  #div8  { grid-area: div8; }
  #div9  { grid-area: div9; }
  #div10 { grid-area: div10; }
  #div11 { grid-area: div11; display: none; }
  #div12 { grid-area: div12; }
  #div13 { grid-area: div13; }
  #div14 { grid-area: div14; }
  #div15 { grid-area: div15; }
`;

export default CounterLoading;
