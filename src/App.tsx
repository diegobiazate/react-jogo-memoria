import { useEffect, useState } from 'react';
import * as C from './App.styles';
import logoImg from './assets/devmemory_logo.png';
import restartIcon from './svgs/restart.svg';
import { ButtonItem } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { formatTime } from './helpers/formatTime';


const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);
  const [finish, setFinish] = useState<boolean>(false);

  useEffect(() => resetAndCreatGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  // verificando se as cartas viradas são iguais
  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if (opened.length === 2) {
        if (opened[0].item === opened[1].item) {
          // se os dois forem iguais, setar o "permanentShown" como true;
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        } else {
          // se os 2 forem diferentes, setar o "shown" como false;
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000);
        }

        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  useEffect(() => {
    if (moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
      setFinish(true);
    }
  }, [moveCount, gridItems]);

  const resetAndCreatGrid = () => {
    // passo 1- resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);
    setFinish(false);

    //passo 2 - criar o grid e começar o jogo

    //passo 2.1 - criar o grid vazio
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null, shown: false, permanentShown: false
      });
    }
    //passo 2.2 - preencher o grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }
    //passo 2.3 - jogar no state
    setGridItems(tmpGrid);

    //passo 3 - começar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid);
    }
  }

  return (
    <>
      <C.Container>
        <C.Info>
          <C.LogoLink href="">
            <img src={logoImg} alt="" width={200} />
          </C.LogoLink>
          <C.InfoArea>
            <InfoItem label='Tempo' value={formatTime(timeElapsed)} />
            <InfoItem label='Movimentos' value={moveCount.toString()} />
          </C.InfoArea>
          <ButtonItem label='Reiniciar' icon={restartIcon} onClick={resetAndCreatGrid} />
        </C.Info>
        <C.GridArea>
          <C.Grid>
            {gridItems.map((item, index) => (
              <GridItem
                key={index}
                item={item}
                onClick={() => handleItemClick(index)}
              />
            ))}
          </C.Grid>
        </C.GridArea>
      </C.Container>
      <C.Finish>
        {finish &&
          <h1>Parabéns, você completou o jogo!</h1>
        }
      </C.Finish>
    </>

  );
}

export default App;
