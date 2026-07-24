import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
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
  image_mobile: 'img_mobile.png',
  id: 'bun-id-1'
};

const mockIngredient: TConstructorIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  proteins: 5,
  fat: 10,
  carbohydrates: 15,
  calories: 100,
  price: 50,
  image: 'img2.png',
  image_large: 'img2_large.png',
  image_mobile: 'img2_mobile.png',
  id: 'ingredient-id-1'
};

const mockIngredient2: TConstructorIngredient = {
  _id: '3',
  name: 'Начинка 2',
  type: 'main',
  proteins: 5,
  fat: 10,
  carbohydrates: 15,
  calories: 100,
  price: 50,
  image: 'img3.png',
  image_large: 'img3_large.png',
  image_mobile: 'img3_mobile.png',
  id: 'ingredient-id-2'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructorSlice reducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('должен добавить булку в конструктор', () => {
    const state = reducer(initialState, {
      type: addIngredient.type,
      payload: mockBun
    });
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен заменить булку если добавить новую', () => {
    const stateWithBun = { bun: mockBun, ingredients: [] };
    const newBun = { ...mockBun, _id: '99', id: 'bun-id-2' };
    const state = reducer(stateWithBun, {
      type: addIngredient.type,
      payload: newBun
    });
    expect(state.bun).toEqual(newBun);
  });

  it('должен добавить начинку в конструктор', () => {
    const state = reducer(initialState, {
      type: addIngredient.type,
      payload: mockIngredient
    });
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockIngredient);
  });

  it('должен удалить начинку из конструктора', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = reducer(
      stateWithIngredient,
      removeIngredient('ingredient-id-1')
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('ingredient-id-2');
  });

  it('должен переместить ингредиент вниз', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = reducer(
      stateWithIngredients,
      moveIngredient({ from: 0, to: 1 })
    );
    expect(state.ingredients[0].id).toBe('ingredient-id-2');
    expect(state.ingredients[1].id).toBe('ingredient-id-1');
  });

  it('должен переместить ингредиент вверх', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = reducer(
      stateWithIngredients,
      moveIngredient({ from: 1, to: 0 })
    );
    expect(state.ingredients[0].id).toBe('ingredient-id-2');
    expect(state.ingredients[1].id).toBe('ingredient-id-1');
  });

  it('должен очистить конструктор', () => {
    const stateWithData = {
      bun: mockBun,
      ingredients: [mockIngredient]
    };
    const state = reducer(stateWithData, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
