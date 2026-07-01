import React, { useState } from 'react';
import { useTenant, useSwitchUIStyle, UIStyleEngine } from '@multi-restaurant/database';
import styles from './ThemeConfigurator.module.css';

export const ThemeConfigurator: React.FC = () => {
  const tenant = useTenant();
  const { currentStyle, switchStyle } = useSwitchUIStyle();

  const [primaryColor, setPrimaryColor] = useState(tenant.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(tenant.secondaryColor);
  const [backgroundColor, setBackgroundColor] = useState(tenant.backgroundColor);
  const [accentColor, setAccentColor] = useState(tenant.accentColor);

  const handleStyleChange = (newStyle: UIStyleEngine) => {
    switchStyle(newStyle);
  };

  const handleColorUpdate = () => {
    tenant;
  };

  const styleOptions: { label: string; value: UIStyleEngine }[] = [
    { label: 'Brutalist Modernist', value: 'BRUTALIST_MODERNIST' },
    { label: 'Minimalist Clean', value: 'MINIMALIST_CLEAN' },
    { label: 'Vibrant Street Tech', value: 'VIBRANT_STREET_TECH' },
  ];

  const getStyleDescription = (style: UIStyleEngine): string => {
    switch (style) {
      case 'BRUTALIST_MODERNIST':
        return 'Sharp borders, heavy black strokes, flat geometric layouts, strong typographic contrast';
      case 'MINIMALIST_CLEAN':
        return 'Subdued 2-4px lines, massive whitespace, soft rounded shapes, elegant neutral palette';
      case 'VIBRANT_STREET_TECH':
        return 'High-saturation dark mode, neon glows, full capsule pills, snappy interactions';
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{tenant.name} Theme Configurator</h1>
        <p className={styles.subtitle}>Multi-Tenant UI Style Engine Configuration</p>
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.section}>
          <h2>UI Style Engine</h2>
          <div className={styles.styleButtons}>
            {styleOptions.map(option => (
              <button
                key={option.value}
                className={`${styles.styleButton} ${currentStyle === option.value ? styles.active : ''}`}
                onClick={() => handleStyleChange(option.value)}
              >
                <div className={styles.styleButtonLabel}>{option.label}</div>
                <div className={styles.styleButtonDesc}>{getStyleDescription(option.value)}</div>
              </button>
            ))}
          </div>
          <div className={styles.currentStyle}>
            <strong>Active Style:</strong> {currentStyle.replace(/_/g, ' ')}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Brand Colors</h2>
          <div className={styles.colorGrid}>
            <div className={styles.colorPicker}>
              <label>Primary Color</label>
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
              />
              <code>{primaryColor}</code>
            </div>

            <div className={styles.colorPicker}>
              <label>Secondary Color</label>
              <input
                type="color"
                value={secondaryColor}
                onChange={e => setSecondaryColor(e.target.value)}
              />
              <code>{secondaryColor}</code>
            </div>

            <div className={styles.colorPicker}>
              <label>Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={e => setBackgroundColor(e.target.value)}
              />
              <code>{backgroundColor}</code>
            </div>

            <div className={styles.colorPicker}>
              <label>Accent Color</label>
              <input
                type="color"
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
              />
              <code>{accentColor}</code>
            </div>
          </div>

          <button className={styles.updateButton} onClick={handleColorUpdate}>
            Update Theme Colors
          </button>
        </section>

        <section className={styles.section}>
          <h2>Live Preview</h2>
          <div
            className={styles.previewBox}
            style={{
              backgroundColor,
              color: primaryColor === '#000000' ? '#FFFFFF' : primaryColor,
              borderColor: primaryColor,
            }}
          >
            <h3>Preview Heading</h3>
            <p>This is how text appears in the {currentStyle.replace(/_/g, ' ')} style.</p>
            <div className={styles.previewButtons}>
              <button
                style={{
                  backgroundColor: primaryColor,
                  color: backgroundColor,
                  border: `2px solid ${secondaryColor}`,
                }}
              >
                Primary Action
              </button>
              <button
                style={{
                  backgroundColor: accentColor,
                  color: backgroundColor,
                  border: `2px solid ${secondaryColor}`,
                }}
              >
                Accent Action
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <h2>Current Restaurant Configuration</h2>
        <div className={styles.configTable}>
          <div className={styles.configRow}>
            <span className={styles.configLabel}>Restaurant ID:</span>
            <code>{tenant.id}</code>
          </div>
          <div className={styles.configRow}>
            <span className={styles.configLabel}>Restaurant Name:</span>
            <strong>{tenant.name}</strong>
          </div>
          <div className={styles.configRow}>
            <span className={styles.configLabel}>Active UI Style:</span>
            <code>{tenant.activeUiStyle}</code>
          </div>
          <div className={styles.configRow}>
            <span className={styles.configLabel}>Border Radius Type:</span>
            <code>{tenant.borderRadiusType}</code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeConfigurator;
