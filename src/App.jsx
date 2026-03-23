import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Printer,
  Settings2,
  Menu
} from 'lucide-react';

export default function App() {
  const [problem, setProblem] = useState("Defecto en el producto final");
  const [categories, setCategories] = useState([
    { id: 1, name: "Mano de Obra", causes: ["Falta de capacitación", "Fatiga del personal"] },
    { id: 2, name: "Máquina", causes: ["Falta de mantenimiento", "Desgaste de piezas"] },
    { id: 3, name: "Método", causes: ["Proceso no estandarizado", "Supervisión deficiente"] },
    { id: 4, name: "Material", causes: ["Materia prima defectuosa", "Retraso del proveedor"] },
    { id: 5, name: "Medición", causes: ["Equipos descalibrados"] },
    { id: 6, name: "Medio Ambiente", causes: ["Exceso de humedad", "Iluminación inadecuada"] }
  ]);

  const [zoom, setZoom] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editing, setEditing] = useState(null);
  const inputRef = useRef(null);

  const updateProblem = (text) => setProblem(text);

  const updateCategoryName = (id, newName) =>
    setCategories(categories.map(cat => cat.id === id ? { ...cat, name: newName } : cat));

  const addCategory = () => {
    if (categories.length >= 6) return;
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    setCategories([...categories, { id: newId, name: "Nueva Categoría", causes: ["Nueva causa"] }]);
  };

  const removeCategory = (id) => setCategories(categories.filter(cat => cat.id !== id));

  const updateCause = (catId, causeIndex, newText) =>
    setCategories(categories.map(cat => {
      if (cat.id !== catId) return cat;
      const newCauses = [...cat.causes];
      newCauses[causeIndex] = newText;
      return { ...cat, causes: newCauses };
    }));

  const addCause = (catId) =>
    setCategories(categories.map(cat =>
      cat.id === catId ? { ...cat, causes: [...cat.causes, "Nueva causa"] } : cat
    ));

  const removeCause = (catId, causeIndex) =>
    setCategories(categories.map(cat =>
      cat.id === catId
        ? { ...cat, causes: cat.causes.filter((_, idx) => idx !== causeIndex) }
        : cat
    ));

  const handlePrint = () => window.print();

  const commitEdit = () => {
    if (!editing) return;
    updateCause(editing.catId, editing.causeIdx, editing.value);
    setEditing(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans overflow-hidden">
      <style>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
          * { overflow: visible !important; }
          html, body, #root {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .hide-on-print { display: none !important; }
          .print-area {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          .print-svg-container {
            transform: none !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
          }
          .print-svg-container svg {
            width: 100% !important;
            height: 100% !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
          }
          main {
            overflow: visible !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          main > div {
            min-width: unset !important;
            min-height: unset !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
        .cause-text { cursor: text; }
        .cause-text:hover { text-decoration: underline; text-decoration-color: #cbd5e1; }
      `}</style>

      {/* Navbar */}
      <header className="hide-on-print bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={20} />
          </button>
          <Settings2 className="text-red-600" />
          <h1 className="text-xl font-bold text-slate-800">Diagrama de Ishikawa</h1>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Printer size={18} />
          Exportar PDF
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden print-area relative">

        {/* Panel Lateral */}
        <aside className={`hide-on-print bg-white flex flex-col h-full shadow-md z-10 transition-[width] duration-300 ease-in-out flex-shrink-0 overflow-hidden ${isSidebarOpen ? 'w-80 border-r border-slate-200' : 'w-0 border-r-0'}`}>
          <div className="w-80 h-full flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Problema Principal</h2>
              <textarea
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none resize-none font-medium"
                rows={2}
                value={problem}
                onChange={(e) => updateProblem(e.target.value)}
                placeholder="Escribe el efecto o problema..."
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Categorías y Causas</h2>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{categories.length}/6</span>
              </div>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        className="flex-1 font-bold bg-white border border-slate-200 px-2 py-1 rounded focus:ring-1 focus:ring-red-500 outline-none text-slate-700"
                        value={cat.name}
                        onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                      />
                      <button onClick={() => removeCategory(cat.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                      {cat.causes.map((cause, causeIdx) => (
                        <div key={causeIdx} className="flex items-center gap-2">
                          <input
                            className="flex-1 text-sm bg-white border border-slate-200 px-2 py-1 rounded focus:ring-1 focus:ring-red-500 outline-none"
                            value={cause}
                            onChange={(e) => updateCause(cat.id, causeIdx, e.target.value)}
                          />
                          <button onClick={() => removeCause(cat.id, causeIdx)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => addCause(cat.id)} className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1 mt-2">
                        <Plus size={12} /> Agregar causa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {categories.length < 6 && (
                <button onClick={addCategory} className="w-full mt-4 py-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-red-600 hover:border-red-300 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Plus size={18} /> Agregar Categoría
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative flex flex-col bg-slate-100 overflow-hidden">
          <div className="hide-on-print absolute bottom-6 right-6 flex bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden z-20">
            <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="p-2 hover:bg-slate-50 text-slate-600 border-r border-slate-200"><ZoomOut size={20} /></button>
            <button onClick={() => setZoom(1)} className="p-2 hover:bg-slate-50 text-slate-600 font-medium text-sm w-16">{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-2 hover:bg-slate-50 text-slate-600 border-l border-slate-200"><ZoomIn size={20} /></button>
          </div>

          <main className="flex-1 overflow-auto print:overflow-visible print:p-0">
            <div className="flex p-8 print:p-0" style={{ minWidth: `${1500 * zoom}px`, minHeight: `${800 * zoom}px`, width: '100%', height: '100%' }}>
              <div
                className="m-auto print-svg-container transition-transform duration-200 ease-out flex-shrink-0"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', width: '1500px', height: '800px' }}
              >
                <svg viewBox="0 0 1500 800" className="w-full h-full drop-shadow-sm bg-white rounded-xl print:shadow-none print:rounded-none">
                  <defs>
                    <marker id="mainArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
                    </marker>
                    <marker id="boneArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
                    </marker>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect width="100%" height="100%" fill="url(#grid)" className="print:hidden" rx="12" />
                  <line x1="60" y1="400" x2="1180" y2="400" stroke="#1e293b" strokeWidth="6" markerEnd="url(#mainArrow)" />

                  {/* Caja problema */}
                  <foreignObject x="1200" y="320" width="240" height="160">
                    <div className="flex items-center justify-center w-full h-full p-4 bg-red-50 border-4 border-red-500 rounded-xl shadow-lg">
                      <textarea
                        value={problem}
                        onChange={(e) => updateProblem(e.target.value)}
                        className="w-full h-full text-center font-bold text-red-900 bg-transparent resize-none outline-none"
                        placeholder="Problema..."
                      />
                    </div>
                  </foreignObject>

                  {categories.map((cat, index) => {
                    const isTop = index % 2 === 0;
                    const pairIndex = Math.floor(index / 2);

                    const xInt = 410 + pairIndex * 350;
                    const xEnd = 160 + pairIndex * 350;
                    const yEnd = isTop ? 100 : 700;
                    const catBoxY = isTop ? yEnd - 66 : yEnd + 16;

                    return (
                      <g key={cat.id}>
                        {/* Línea diagonal */}
                        <line x1={xEnd} y1={yEnd} x2={xInt} y2={400} stroke="#475569" strokeWidth="4" markerEnd="url(#boneArrow)" />

                        {/* Caja categoría */}
                        <foreignObject x={xEnd - 100} y={catBoxY} width="200" height="50">
                          <div className="w-full h-full bg-slate-800 text-white rounded-lg flex items-center justify-center border-2 border-slate-900 shadow-md px-3">
                            <input
                              value={cat.name}
                              onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                              className="w-full bg-transparent text-center font-bold outline-none text-base tracking-wide"
                              placeholder="Categoría"
                              style={{ lineHeight: '46px', padding: 0, textDecoration: 'none' }}
                            />
                          </div>
                        </foreignObject>

                        {cat.causes.map((cause, cIdx) => {
                          const cCount = cat.causes.length;
                          const t = (cIdx + 1) / (cCount + 1);

                          const xC = xEnd + t * (xInt - xEnd);
                          const yC = yEnd + t * (400 - yEnd);

                          const lineLength = 160;
                          const lineX1 = Math.max(30, xC - lineLength);

                          const isEditingThis = editing && editing.catId === cat.id && editing.causeIdx === cIdx;

                          const textDy = "-10";
                          const foreignObjectY = yC - 22;
                          // ← FIX: arriba ancla en lineX1, pero si el texto es más ancho
                          //         que el espacio disponible lo recorre a la izquierda
                          const estimatedTextWidth = cause.length * 6.4;
                          const availableSpace = xC - lineX1;
                          const topTextX = lineX1 - Math.max(0, estimatedTextWidth - availableSpace + 18);
                          const textX = isTop ? topTextX : xC;
                          const anchor = isTop ? "start" : "end";

                          return (
                            <g key={cIdx}>
                              {/* Línea horizontal */}
                              <line x1={lineX1} y1={yC} x2={xC} y2={yC} stroke="#64748b" strokeWidth="2" />

                              {isEditingThis ? (
                                <foreignObject x={lineX1} y={foreignObjectY} width={xC - lineX1} height={22}>
                                  <input
                                    ref={inputRef}
                                    autoFocus
                                    value={editing.value}
                                    onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                                    onBlur={commitEdit}
                                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); }}
                                    style={{
                                      width: '100%',
                                      height: '22px',
                                      lineHeight: '22px',
                                      padding: '0 3px 0 0',
                                      boxSizing: 'border-box',
                                      display: 'block',
                                      background: '#f0f9ff',
                                      border: 'none',
                                      borderBottom: '1.5px solid #3b82f6',
                                      outline: 'none',
                                      textAlign: 'right',
                                      fontSize: '13px',
                                      color: '#1e40af',
                                      fontWeight: '500',
                                      fontFamily: 'inherit',
                                      textDecoration: 'none',
                                    }}
                                  />
                                </foreignObject>
                              ) : (
                                <text
                                  className="cause-text"
                                  x={textX}
                                  y={yC}
                                  dy={textDy}
                                  textAnchor={anchor}
                                  fontSize="13"
                                  fill="#334155"
                                  fontWeight="500"
                                  fontFamily="inherit"
                                  onClick={() => setEditing({ catId: cat.id, causeIdx: cIdx, value: cause })}
                                >
                                  {cause || "Causa..."}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}