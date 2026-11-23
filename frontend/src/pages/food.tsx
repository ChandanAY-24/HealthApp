import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { useActions } from '../actions';
import { Utensils, Droplet, Plus, Check } from '../ui/icons';
import { Button, Modal, Input, Badge } from '../ui/kit';

export const FoodPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const { notify } = useActions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('450');
  const [protein, setProtein] = useState('25');
  const [carbs, setCarbs] = useState('40');
  const [fat, setFat] = useState('15');
  const [iron, setIron] = useState('3.2');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');

  useEffect(() => {
    const unsub = store.subscribe(() => setState(store.getState()));
    return unsub;
  }, []);

  const totalCalories = state.meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = state.meals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbs = state.meals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFat = state.meals.reduce((acc, m) => acc + m.fatGrams, 0);
  const totalIron = state.meals.reduce((acc, m) => acc + m.ironMg, 0);

  const handleAddMeal = () => {
    if (!mealName.trim()) return;
    store.logMeal(
      {
        name: mealName,
        calories: parseInt(calories) || 0,
        proteinGrams: parseFloat(protein) || 0,
        carbsGrams: parseFloat(carbs) || 0,
        fatGrams: parseFloat(fat) || 0,
        ironMg: parseFloat(iron) || 0,
        mealType,
        date: new Date().toISOString().split('T')[0],
      },
      notify
    );
    setMealName('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-950)' }}>Nutrition & Water</h1>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.9375rem' }}>
            Dietary macros, micronutrients (iron), and hydration logging.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Log Meal
        </Button>
      </div>

      {/* Daily Macro Grid */}
      <div className="macro-grid">
        <div className="macro-box">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-500)' }}>Calories</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalCalories} kcal</span>
        </div>
        <div className="macro-box">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-500)' }}>Protein</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalProtein}g</span>
        </div>
        <div className="macro-box">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-500)' }}>Carbs</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalCarbs}g</span>
        </div>
        <div className="macro-box">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-500)' }}>Fat</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalFat}g</span>
        </div>
        <div className="macro-box">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--lime-600)' }}>Iron</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalIron.toFixed(1)}mg</span>
        </div>
      </div>

      {/* Hydration Box */}
      <div className="card-section">
        <div className="section-title-row">
          <h2 className="section-title">
            <Droplet size={18} color="var(--lime-600)" />
            Water Consumption
          </h2>
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {state.waterGlassesToday} of 8 glasses
          </span>
        </div>
        <div className="water-meter">
          <div className="water-progress-bar">
            <div className="water-fill" style={{ width: `${Math.min(100, (state.waterGlassesToday / 8) * 100)}%` }}></div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => store.logWater(1, notify)}>
            <Plus size={14} /> +1 Glass (250ml)
          </Button>
        </div>
      </div>

      {/* Meals Logged */}
      <div className="card-section">
        <div className="section-title-row">
          <h2 className="section-title">
            <Utensils size={18} color="var(--lime-600)" />
            Today's Logged Meals
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {state.meals.map((m) => (
            <div key={m.id} className="meal-row">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink-900)' }}>{m.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)' }}>
                  {m.mealType} • Protein: {m.proteinGrams}g, Carbs: {m.carbsGrams}g, Fat: {m.fatGrams}g, Iron: {m.ironMg}mg
                </div>
              </div>
              <Badge variant="lime">{m.calories} kcal</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Log Meal Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Meal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Meal Name / Description" value={mealName} onChange={(e) => setMealName(e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Calories (kcal)" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
            <Input label="Protein (g)" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
            <Input label="Carbs (g)" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            <Input label="Fat (g)" type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
          <Input label="Iron (mg)" type="number" value={iron} onChange={(e) => setIron(e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleAddMeal}>
              Save Meal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
