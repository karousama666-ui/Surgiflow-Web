import React, { createContext, useState, useEffect, useContext } from 'react';

// Cria o contexto
const ThemeContext = createContext();

// Hook personalizado para usar o tema facilmente em qualquer tela
export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // Tenta puxar a preferência salva no navegador, se não achar, usa 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('surgiflow_theme');
    return savedTheme ? savedTheme : 'light';
  });

  // Toda vez que o tema mudar, salva no navegador e injeta uma classe no <body> da página
  useEffect(() => {
    localStorage.setItem('surgiflow_theme', theme);
    
    // Isso aplica a classe "dark-mode" na raiz do site para o CSS fazer a mágica
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Função para virar a chavinha
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}