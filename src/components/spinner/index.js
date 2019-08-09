import React, {useState, useEffect, useRef} from 'react';
import styles from './spinner.module.scss';



function splitCircumference(r, n){
    
    const arcAngle = Math.PI * 2 / n;
    let arcArr = [];
    for(let i=0; i< Math.PI * 2; i+=arcAngle) {
        let x = r * Math.cos(i);
        let y = r * Math.sin(i);
        arcArr.push([x,y]);
    };
    return arcArr;
};

function opacityScale(n){
    let opArr = [];
    for (let i=0; i<n; i++){
        let op = Math.floor((i/n)*100)/100;
        opArr.push(op);
    };

    return opArr;
};

const N = 28;
const euStarOrigins = splitCircumference(1200, N);
const euStarOpacities = opacityScale(N);


const Spinner = () => {
    
    const [starOpacityArr, setStarOpacityArr] = useState(euStarOpacities);
    
    const starOrigins = useRef([]);
    const opacityRef = useRef([]);

    starOrigins.current = euStarOrigins;
    opacityRef.current = starOpacityArr;
    
    useEffect(() => {
        const timer = setInterval(() => {
            let futureArr = [...opacityRef.current];
            futureArr.unshift(futureArr.pop());
            setStarOpacityArr(futureArr);
        }, 50);

        return () => clearInterval(timer);
    },[])

    return (
        <>
        <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="98" height="98"
            viewBox="49 49 2650 2650"
            className={styles.spinner}
        >
            <defs>
                <path 
                    id="star" fill="#cc2"
                    d="m55,237 74-228 74,228L9,96h240"
                />
            </defs>        
            {
                starOrigins.current.map((star, ix) => 
                    <use xlinkHref="#star"
                        key={ix}
                        x={1250 + star[0]} 
                        y={1200 + star[1]}
                        opacity={starOpacityArr[ix]}
                    />
                    )
            }
        </svg>
        </>
    );
};

export default Spinner;