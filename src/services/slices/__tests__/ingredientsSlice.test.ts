import reducer, {
  fetchIngredients
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'img.png',
  image_large: 'img_large.png',
  image_mobile: 'img_mobile.png'
};

const initialState = {
  ingredients: [],
  loading: false,
  error: null
};

describe('ingredientsSlice reducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('должен установить loading: true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен установить loading: false и error при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' }
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });

  it('должен установить ingredients при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [mockIngredient]
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
    expect(state.error).toBeNull();
  });
});
