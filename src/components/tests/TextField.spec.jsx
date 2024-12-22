import { screen } from '@testing-library/react';
import React from 'react';
import { expect, describe, beforeEach } from 'vitest';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

/**
 * AAA 패턴 (Arrange-Act-Assert)
 * Arrange: 테스트를 위한 환경 만들기 (컴포넌트 랜더링)
 * Act 테스트할 동작 시뮬레이션 (클릭, 타이핑, 메서드 호출)
 * Assert: 기대 결과대로 실행되었는지 검증
 */

/**
 * Arrange - 테스트를 위한 환경 만들기
 * -> className을 지닌 컴포넌트 렌더링
 * Act - 테스트할 동작 발생
 * -> 렌더링에 대한 검증이기 때문에 이 단계는 생략
 * -> 클릭이나 메서드 호출 prop 변경 등등에 대한 작업이 여기에 해당
 * Assert - 올바른 동작이 실행되었지 검증
 * -> 랜더링 후 DOM에 해당 class가 존재하는지 검증
 */

// 전역변수를 사용한 조건 처리는 독립성을 보장하지 못하고 신뢰성이 낮아진다.
// setup이나 teardown에서 작성하지 않는 것이 좋다.
// 다른 테스트에 영향을 줄 수 있기 때문
beforeEach(async () => {
  await render(<TextField className="my-class" />);
});

it('className prop으로 설정한 css class가 적용된다.', async () => {
  // 렌더링을 위해 render api를 사용 -> 테스트 환경의 jsDOM에 리액트 컴포넌트가 랜더링된 DOM 구조가 반영
  // jsDOM: Node.js에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현

  // vitest 의 expect 함수를 사용하여 기대 결과를 검증
  // 랜더링되는 DOM 구조가 올바르게 변경되었는지 확인
  expect(screen.getByPlaceholderText('텍스트를 입력해 주세요.')).toHaveClass(
    'my-class ',
  );
});

// it > 기대결과
// it: test 함수의 alias
// it 함수는 독립된 컨텍스트를 갖는다. (최상위 컨텍스트)
// describe 함수는 그룹을 가질 수 있어서 테스트 코드를 그루핑 할 수 있다.
describe('placeholder', () => {
  it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다.', async () => {
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    expect(textInput).toBeInTheDocument();
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    const placeholder = 'PlaceHolder 입니다.';
    await render(<TextField placeholder={placeholder} />);

    const textInput = screen.getByPlaceholderText(placeholder);

    expect(textInput).toBeInTheDocument();
  });
});
/**
 *  * 텍스트를 입력할 때마다 onChange 핸들러 호출
 * focus 시 border 스타일 변경
 * focus 시 onFocus 핸들러 호출
 * Enter 키 입력 시 onEnter 핸들러 호출
 */

it('텍스트를 입력할 때마다 onChange 핸들러 호출한다.', async () => {
  const spy = vi.fn(); // 스파이 함수
  // 스파이 함수: 테스트 코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지 어떤 값을 반환하는지 등 다양한 값을 저장
  const { user } = await render(
    <TextField onChange={spy} placeholder="상품명을 입력해 주세요." />,
  );
  const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

  await user.type(textInput, 'test');

  expect(spy).toHaveBeenCalledWith('test');
});

it('엔터키를 입력하면 onEnter 이벤트 핸들러가 작동한다.', async () => {
  const spy = vi.fn();
  const { user } = await render(
    <TextField placeholder="상품명을 입력해 주세요." onEnter={spy} />,
  );

  const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

  await user.type(textInput, 'test{Enter}'); // Enter, Space, Alt 키 등을 검증할 수 있음 eg. {Enter}
  expect(spy).toHaveBeenCalledWith('test');
});

it('focus 시 onFocus 핸들러가 동작한다.', async () => {
  // 탭 키로 인풋 요소로 포커스 이동
  // 인풋 요소를 클릭했을때
  // textInput.focus() 로 직접 발생
  const spy = vi.fn();
  const { user } = await render(
    <TextField placeholder="상품명을 입력해 주세요." onFocus={spy} />,
  );

  const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

  await user.click(textInput);
  // click과 연관 -> 포커스, 마우스다운, 마우스업 등 이벤트를 검증할 수 있다.
  expect(spy).toHaveBeenCalled();
});

it('focus 시 border 스타일이 변경된다.', async () => {
  const { user } = await render(
    <TextField placeholder="상품명을 입력해 주세요." />,
  );

  const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

  await user.click(textInput);

  expect(textInput).toHaveStyle({
    borderWidth: 2,
    borderColor: 'rgb(25, 118, 210)',
  });
});
