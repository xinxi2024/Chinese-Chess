import React, { useState } from 'react';
import '../styles/StartScreen.css';

const StartScreen = ({ onStartGame, onThemeChange }) => {
  const [selectedMode, setSelectedMode] = React.useState('pvp');
  const [selectedTheme, setSelectedTheme] = React.useState('classic');
  const [showRules, setShowRules] = React.useState(false);
  const [showFlipRules, setShowFlipRules] = React.useState(false);
  const [showRuleTypeModal, setShowRuleTypeModal] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  const handleStartGame = () => {
    onStartGame(selectedMode, selectedTheme, difficulty);
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    onThemeChange(theme);
  };

  return (
    <div className="start-screen" style={{ width: "500px" }}>
      <h1>中国象棋</h1>
      
      <div className="mode-selection">
        <h2>选择游戏模式</h2>
        <select 
          value={selectedMode} 
          onChange={(e) => setSelectedMode(e.target.value)}
          className="theme-select"
        >
          <option value="pvp">双人对战</option>
          <option value="pve">人机对战</option>
          <option value="custom" disabled>自定义残局(维护中)</option>
        </select>
        
        {selectedMode === 'pve' && (
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="theme-select"
            style={{ marginTop: '1rem' }}
          >
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        )}
      </div>

      <div className="theme-selection">
        <h2>主题设置</h2>
        <select 
          value={selectedTheme} 
          onChange={(e) => handleThemeChange(e.target.value)}
          className="theme-select"
        >
          <option value="classic">经典主题</option>
          <option value="modern">现代主题</option>
          <option value="ink">水墨主题</option>
          <option value="retro">复古主题</option>
          <option value="neon">霓虹主题</option>
        </select>
      </div>

      {showRules && (
        <div className="modal-overlay" onClick={() => setShowRules(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>游戏规则</h2>
            <ul>
              <li>红方先行，双方轮流移动棋子</li>
              <li>每次只能移动一个己方棋子</li>
              <li>不能吃掉己方棋子</li>
              <li>将帅不能直接对面</li>
              <li>棋子移动需遵循各自的规则：</li>
              <ul>
                <li>车：直线移动，不能跨过其他棋子</li>
                <li>马：走"日"字，蹩马腿时不能移动</li>
                <li>相：走"田"字，不能过河，塞相眼时不能移动</li>
                <li>士：斜线移动一格，不能出九宫</li>
                <li>将/帅：上下左右移动一格，不能出九宫</li>
                <li>炮：直线移动，吃子时需要一个炮台</li>
                <li>兵/卒：只能向前移动，过河后可以左右移动</li>
              </ul>
            </ul>
            <button className="close-button" onClick={() => setShowRules(false)}>关闭</button>
          </div>
        </div>
      )}

      {showFlipRules && (
        <div className="modal-overlay" onClick={() => setShowFlipRules(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>翻棋模式规则</h2>
            <ul>
              <li>游戏目标：通过翻转棋子，按照象棋规则对战，将对方的帅（将）困毙获胜。</li>
              <li>基本规则：</li>
              <ul>
                <li>所有棋子开局时正面朝下</li>
                <li>每回合可以翻转一个棋子或移动一个已翻开的棋子</li>
                <li>翻转到对方的帅（将）可以直接获胜</li>
                <li>已翻开的棋子按照标准象棋规则移动</li>
              </ul>
              <li>特殊规则：</li>
              <ul>
                <li>盲棋阶段：前5回合只能翻棋，不能移动</li>
                <li>翻转保护：新翻开的棋子在接下来的两回合内不能被吃</li>
                <li>翻转陷阱：翻到对方的炮或马时，如果可以直接吃子则必须执行</li>
              </ul>
            </ul>
            <button className="close-button" onClick={() => setShowFlipRules(false)}>关闭</button>
          </div>
        </div>
      )}

      {showRuleTypeModal && (
        <div className="modal-overlay" onClick={() => setShowRuleTypeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>选择规则类型</h2>
            <div className="button-group">
              <button onClick={() => {
                setShowRuleTypeModal(false);
                setShowRules(true);
              }}>经典规则</button>
              <button onClick={() => {
                setShowRuleTypeModal(false);
                setShowFlipRules(true);
              }}>翻棋规则</button>
            </div>
            <button className="close-button" onClick={() => setShowRuleTypeModal(false)}>关闭</button>
          </div>
        </div>
      )}
      <div className="button-group">
        <button className="start-button" onClick={() => setShowRuleTypeModal(true)}>
          查看规则
        </button>
        <button className="start-button" onClick={handleStartGame}>
          开始游戏
        </button>
      </div>
    </div>
  );
};

export default StartScreen;