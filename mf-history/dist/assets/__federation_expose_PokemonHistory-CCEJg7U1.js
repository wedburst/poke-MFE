import { importShared } from './__federation_fn_import-esthdjKb.js';
import { r as requireReact } from './index-DQGM2Mpm.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;

function requireReactJsxRuntime_production_min () {
	if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
	hasRequiredReactJsxRuntime_production_min = 1;
var f=requireReact(),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
	function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;
	return reactJsxRuntime_production_min;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production_min();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

const React = await importShared('react');
const {useState,useEffect,useCallback} = React;

const STORAGE_KEY = "pokemon_history";
const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};
const PokemonHistory = ({ theme = "light", onSelect }) => {
  const [history, setHistory] = useState(getHistory);
  const isDark = theme === "dark";
  const refresh = useCallback(() => setHistory(getHistory()), []);
  useEffect(() => {
    const handler = (e) => {
      if (!e.key || e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener("storage", handler);
    window.addEventListener("pokemon_history_updated", refresh);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("pokemon_history_updated", refresh);
    };
  }, [refresh]);
  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("pokemon_history_updated"));
    refresh();
  };
  if (history.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 gap-3",
        style: { fontFamily: "system-ui, sans-serif", color: isDark ? "#9CA3AF" : "#6B7280" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png",
              alt: "empty",
              style: { width: 48, height: 48, opacity: 0.4 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 14 }, children: "No visited Pokemon yet" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        fontFamily: "system-ui, sans-serif",
        color: isDark ? "#F9FAFB" : "#111827"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  style: {
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: isDark ? "#9CA3AF" : "#6B7280"
                  },
                  children: "Recently Visited"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: clearHistory,
                  style: {
                    fontSize: 11,
                    color: "#EF4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 4
                  },
                  onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#FEE2E2",
                  onMouseOut: (e) => e.currentTarget.style.backgroundColor = "transparent",
                  children: "Clear All"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 12
            },
            children: history.map((pokemon) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => onSelect && onSelect(pokemon.name),
                style: {
                  background: isDark ? "#1F2937" : "#F9FAFB",
                  border: isDark ? "1px solid #374151" : "1px solid #E5E7EB",
                  borderRadius: 12,
                  padding: "12px 8px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s ease",
                  position: "relative"
                },
                onMouseOver: (e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.12)";
                },
                onMouseOut: (e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "#EF4444",
                        color: "white",
                        fontSize: 9,
                        fontWeight: 700,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      },
                      children: pokemon.visits > 99 ? "99+" : pokemon.visits
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: pokemon.image,
                      alt: pokemon.name,
                      style: { width: 56, height: 56, objectFit: "contain" },
                      onError: (e) => {
                        e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "capitalize",
                        textAlign: "center",
                        color: isDark ? "#D1D5DB" : "#374151"
                      },
                      children: pokemon.name
                    }
                  )
                ]
              },
              pokemon.name
            ))
          }
        )
      ]
    }
  );
};

export { PokemonHistory as default, jsxRuntimeExports as j };
