import { Character, CardRole, PlayerStats } from '../../data/characters';
import { useState, useMemo } from 'react';

interface PlayerCardProps {
  character: Character;
}

// 六维雷达图 SVG 生成器
function renderRadar(stats: PlayerStats): string {
  const cx = 90, cy = 90, maxR = 72;
  const labels = ['射门', '速度', '盘带', '传球', '防守', '体能'];
  const values = [stats.sho, stats.pac, stats.dri, stats.pas, stats.def, stats.phy];
  const colors = ['#FF6B35', '#4A90D9', '#7BB8E8', '#FFD700', '#00387E', '#5B2C8E'];

  const point = (r: number, i: number) => {
    const angle = ((i * 60) - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  let svg = `<svg viewBox="0 0 180 180">`;

  // 5 层网格
  for (let r = 1; r <= 5; r++) {
    const R = maxR * (r / 5);
    const pts = Array.from({ length: 6 }, (_, i) => {
      const p = point(R, i);
      return `${p.x},${p.y}`;
    }).join(' ');
    svg += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="0.8"/>`;
  }

  // 6 条轴线
  for (let i = 0; i < 6; i++) {
    const p = point(maxR, i);
    svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.02)" stroke-width="0.8"/>`;
  }

  // 数据多边形
  const dataPts = Array.from({ length: 6 }, (_, i) => {
    const r = maxR * (values[i] / 100) * 0.95;
    const p = point(r, i);
    return `${p.x},${p.y}`;
  }).join(' ');
  svg += `<polygon points="${dataPts}" fill="rgba(74,144,217,0.06)" stroke="#4A90D9" stroke-width="1.5" stroke-linejoin="round"/>`;

  // 数据点
  for (let i = 0; i < 6; i++) {
    const r = maxR * (values[i] / 100) * 0.95;
    const p = point(r, i);
    svg += `<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="${colors[i]}" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>`;
  }

  // 标签
  for (let i = 0; i < 6; i++) {
    const p = point(maxR + 15, i);
    const anchor = i === 0 || i === 3 ? 'middle' : (i < 3 ? 'start' : 'end');
    svg += `<text x="${p.x}" y="${p.y}" fill="${colors[i]}" font-family="monospace" font-size="8" font-weight="600" text-anchor="${anchor}" dominant-baseline="middle">${labels[i]}</text>`;
  }

  svg += '</svg>';
  return svg;
}

const statDefs: { key: keyof PlayerStats; label: string; colorClass: string }[] = [
  { key: 'sho', label: '射门', colorClass: 'sho' },
  { key: 'pac', label: '速度', colorClass: 'pac' },
  { key: 'pas', label: '传球', colorClass: 'pas' },
  { key: 'dri', label: '盘带', colorClass: 'dri' },
  { key: 'def', label: '防守', colorClass: 'def' },
  { key: 'phy', label: '体能', colorClass: 'phy' },
];

const roleLabels: Record<CardRole, string> = {
  gk: '门将',
  def: '后卫',
  mid: '中场',
  fwd: '前锋',
  staff: '教练/经理',
};

export const PlayerCard = ({ character }: PlayerCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const radarSvg = useMemo(
    () => renderRadar(character.stats),
    [character.stats.sho, character.stats.pac, character.stats.dri, character.stats.pas, character.stats.def, character.stats.phy],
  );

  const isStaff = character.role === 'staff';
  const isGK = character.role === 'gk';

  return (
    <div
      className="flip-container cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
        {/* ──────── 正面：照片 ──────── */}
        <div className="card-front">
          <img
            className="front-bg"
            src={character.image}
            alt={character.name}
            loading="lazy"
          />
          <div className="front-overlay" />
          <div className="front-top">
            <span className="front-num">
              {character.number ? String(character.number).padStart(2, '0') : '--'}
            </span>
            {isStaff ? (
              <span className="front-badge" style={{ fontSize: 10 }}>STAFF</span>
            ) : (
              <span className="front-num" style={{ fontSize: 52 }}>
                {character.number ? String(character.number).padStart(2, '0') : '--'}
              </span>
            )}
          </div>
          <div className="front-name-bottom">
            <div className="front-name">{character.name}</div>
            {!isStaff && (
              <div className="front-sub">{character.position}</div>
            )}
          </div>
        </div>

        {/* ──────── 背面：数据 ──────── */}
        <div className={`card-back ${isStaff ? 'coach' : ''}`}>
          <div className="top-bar" />
          <div className="inner">
            {/* 顶部：学校 + 号码 */}
            <div className="back-top">
              <div className="back-school">
                <div className="badge">🏫</div>
                <span className="name" style={{ fontSize: 8, fontWeight: 600, letterSpacing: 1.5, color: 'rgba(255,255,255,0.12)' }}>HUST·新闻</span>
              </div>
              <div className="back-number">
                {character.number ? String(character.number).padStart(2, '0') : '--'}
              </div>
            </div>

            {/* 身份：位置 + 姓名 */}
            <div className="back-identity">
              <div className="back-pos-badge">
                {isStaff ? 'STF' : character.position.includes('门') ? 'GK' :
                 character.position.includes('后') || character.position.includes('卫') ? 'DEF' :
                 character.position.includes('中') || character.position.includes('腰') ? 'MID' : 'FWD'}
              </div>
              <div className="back-name-wrap">
                <div className="back-name-cn">{character.name}</div>
                <div className="back-name-en">{roleLabels[character.role].toUpperCase()}</div>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="back-bio">
              <span>📏 {character.height}cm</span>
              <span>⚖️ {character.weight}kg</span>
              <span>🎂 {character.age}岁</span>
            </div>

            {/* 门将特殊布局 */}
            {isGK && (
              <>
                <div className="gk-big-stats">
                  <div className="gk-stat">
                    <div className="gk-stat-val" style={{ color: '#4A90D9' }}>{character.stats.sho}</div>
                    <div className="gk-stat-label">反应</div>
                  </div>
                  <div className="gk-stat">
                    <div className="gk-stat-val" style={{ color: '#7BB8E8' }}>{character.stats.phy}</div>
                    <div className="gk-stat-label">跳起</div>
                  </div>
                  <div className="gk-stat">
                    <div className="gk-stat-val" style={{ color: '#4A90D9' }}>{character.stats.pac}</div>
                    <div className="gk-stat-label">出击</div>
                  </div>
                </div>
                <div className="gk-sub-bars">
                  {statDefs.filter(s => s.key === 'dri' || s.key === 'pas' || s.key === 'def').map(s => (
                    <StatRow key={s.key} stat={s} value={character.stats[s.key]} />
                  ))}
                </div>
              </>
            )}

            {/* 教练/经理特殊布局 */}
            {isStaff && character.title === 'HEAD COACH' && (
              <div className="coach-content">
                <div className="coach-icon">🏆</div>
                <div className="coach-title">{character.title}</div>
                <div className="coach-desc">{character.desc}</div>
                <div className="coach-stats">
                  <div className="coach-stat">
                    <div className="coach-stat-val">{character.stats.sho}</div>
                    <div className="coach-stat-lbl">进攻</div>
                  </div>
                  <div className="coach-stat">
                    <div className="coach-stat-val">{character.stats.pac}</div>
                    <div className="coach-stat-lbl">速度</div>
                  </div>
                  <div className="coach-stat">
                    <div className="coach-stat-val">{character.stats.phy}</div>
                    <div className="coach-stat-lbl">体能</div>
                  </div>
                </div>
              </div>
            )}

            {isStaff && character.title === 'MANAGER' && (
              <div className="manager-content">
                <div className="manager-name">{character.name}</div>
                <div className="manager-title">{character.title}</div>
                <div className="manager-desc">{character.desc}</div>
              </div>
            )}

            {/* 普通球员：雷达图 + 六维 */}
            {!isGK && !isStaff && (
              <>
                <div className="radar-wrap" dangerouslySetInnerHTML={{ __html: radarSvg }} />
                <div className="stat-grid">
                  {statDefs.map(s => (
                    <StatRow key={s.key} stat={s} value={character.stats[s.key]} />
                  ))}
                </div>
              </>
            )}

            {/* 底部：技能 + 学校标签 */}
            <div className="card-footer">
              <span className="skill-tag">{character.skill}</span>
              <span className="school-tag">HUST·JC</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS-in-JS styles */}
      <style>{`
        .flip-container {
          width: 310px;
          height: 480px;
          perspective: 1200px;
          animation: fadeUp 0.5s ease backwards;
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          inset: 0;
          overflow: hidden;
          clip-path: polygon(3% 0%, 97% 0%, 100% 2%, 100% 98%, 97% 100%, 3% 100%, 0% 98%, 0% 2%);
        }
        .card-back {
          transform: rotateY(180deg);
          backface-visibility: hidden;
        }
        .card-front {
          backface-visibility: hidden;
        }
        .card-front {
          background: linear-gradient(150deg, #111D35, #0A1220);
        }
        .front-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          pointer-events: none;
        }
        .front-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, transparent 30%, rgba(10,22,40,0.3) 60%, rgba(10,22,40,0.7) 100%);
          pointer-events: none;
        }
        .front-top {
          position: relative;
          z-index: 3;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .front-num {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 52px;
          line-height: 0.8;
          letter-spacing: -2px;
          color: rgba(255,255,255,0.12);
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .front-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.08);
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
        }
        .front-name-bottom {
          position: relative;
          z-index: 3;
          margin-top: auto;
          padding: 0 14px 12px;
        }
        .front-name {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 24px;
          letter-spacing: 2px;
          text-transform: uppercase;
          line-height: 1;
          color: #fff;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .front-sub {
          font-size: 9px;
          font-weight: 300;
          color: rgba(255,255,255,0.1);
          letter-spacing: 2px;
          margin-top: 1px;
        }

        /* 背面 */
        .card-back {
          background: linear-gradient(160deg, #0D1F38, #091220);
        }
        .card-back .top-bar {
          height: 3px;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
          background: linear-gradient(90deg, #4A8EC7, #6B4C9A, #E8C84A);
        }
        .card-back .inner {
          padding: 16px;
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .back-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .back-school {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .back-school .badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1B3A6B, #6B4C9A);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #fff;
          flex-shrink: 0;
        }
        .back-number {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 26px;
          letter-spacing: -1px;
          background: linear-gradient(180deg, #E8C84A, #4A8EC7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .back-identity {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .back-pos-badge {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 1px;
          padding: 1px 10px 0;
          border-radius: 5px;
          background: rgba(74,144,217,0.08);
          border: 1px solid rgba(74,144,217,0.03);
          color: rgba(255,255,255,0.5);
          min-width: 34px;
          text-align: center;
        }
        .back-name-wrap { flex: 1; }
        .back-name-cn { font-size: 15px; font-weight: 600; letter-spacing: 1px; color: rgba(255,255,255,0.85); }
        .back-name-en { font-size: 9px; font-weight: 300; color: rgba(255,255,255,0.12); letter-spacing: 1px; text-transform: uppercase; margin-top: -1px; }
        .back-bio {
          display: flex;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 9px;
          color: rgba(255,255,255,0.12);
        }
        .back-bio span {
          background: rgba(255,255,255,0.02);
          padding: 1px 6px;
          border-radius: 3px;
        }

        /* 雷达图 */
        .radar-wrap {
          display: flex;
          justify-content: center;
          margin: 2px 0 4px;
          flex: 1;
          min-height: 0;
        }
        .radar-wrap svg {
          width: 175px;
          height: 175px;
          filter: drop-shadow(0 4px 16px rgba(74,144,217,0.06));
        }

        /* 六维数值条 */
        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px 8px;
          margin-top: auto;
        }
        .stat-row { display: flex; align-items: center; gap: 4px; }
        .stat-row .stat-label {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.3px;
          min-width: 20px;
          font-family: monospace;
        }
        .stat-row.sho .stat-label { color: #FF6B35; }
        .stat-row.pac .stat-label { color: #4A8EC7; }
        .stat-row.dri .stat-label { color: #8B7BC8; }
        .stat-row.pas .stat-label { color: #E8C84A; }
        .stat-row.def .stat-label { color: #1B3A6B; }
        .stat-row.phy .stat-label { color: #6B4C9A; }
        .stat-row .stat-track {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.02);
          border-radius: 2px;
          overflow: hidden;
        }
        .stat-row .stat-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .stat-row.sho .stat-fill { background: linear-gradient(90deg, #D50000, #FF6B35); }
        .stat-row.pac .stat-fill { background: linear-gradient(90deg, #00387E, #4A8EC7); }
        .stat-row.dri .stat-fill { background: linear-gradient(90deg, #0A1628, #8B7BC8); }
        .stat-row.pas .stat-fill { background: linear-gradient(90deg, #F9A825, #E8C84A); }
        .stat-row.def .stat-fill { background: linear-gradient(90deg, #002060, #1B3A6B); }
        .stat-row.phy .stat-fill { background: linear-gradient(90deg, #1A0A30, #6B4C9A); }
        .stat-row .stat-value {
          font-family: monospace;
          font-size: 9px;
          font-weight: 600;
          min-width: 18px;
          text-align: right;
          color: rgba(255,255,255,0.3);
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(74,144,217,0.02);
        }
        .skill-tag { font-size: 9px; color: rgba(255,255,255,0.1); }
        .school-tag { font-size: 7px; letter-spacing: 1px; color: rgba(255,255,255,0.03); }

        /* 门将 */
        .gk-big-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 4px;
          margin: 4px 0;
        }
        .gk-stat {
          text-align: center;
          padding: 4px;
          border-radius: 4px;
          background: rgba(74,144,217,0.02);
        }
        .gk-stat-val {
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          font-weight: 700;
        }
        .gk-stat-label { font-size: 7px; color: rgba(255,255,255,0.08); }
        .gk-sub-bars {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px 8px;
          margin-bottom: 2px;
        }

        /* 教练 */
        .coach-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .coach-icon { font-size: 28px; margin-bottom: 6px; }
        .coach-title {
          font-size: 20px;
          font-weight: 700;
          font-family: 'Oswald', sans-serif;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: linear-gradient(135deg, #4A8EC7, #7BB8E8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
        }
        .coach-desc { font-size: 10px; color: rgba(255,255,255,0.08); text-align: center; letter-spacing: 2px; margin-bottom: 8px; }
        .coach-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin: auto; }
        .coach-stat { text-align: center; padding: 6px; border-radius: 6px; background: rgba(74,144,217,0.02); border: 1px solid rgba(74,144,217,0.02); }
        .coach-stat-val {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 1;
          background: linear-gradient(180deg, #E8C84A, #4A8EC7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .coach-stat-lbl { font-size: 7px; color: rgba(255,255,255,0.1); letter-spacing: 1px; margin-top: 2px; }

        /* 经理 */
        .manager-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .manager-name {
          font-size: 14px;
          font-weight: 600;
          font-family: 'Oswald', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          text-align: center;
        }
        .manager-title {
          font-size: 9px;
          color: rgba(255,255,255,0.04);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 4px 0 8px;
        }
        .manager-desc {
          font-size: 8px;
          color: rgba(255,255,255,0.07);
          text-align: center;
          max-width: 200px;
        }
      `}</style>
    </div>
  );
};

// 单个能力值条
function StatRow({ stat, value }: { stat: typeof statDefs[0]; value: number }) {
  return (
    <div className={`stat-row ${stat.colorClass}`}>
      <span className="stat-label">{stat.label}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}
