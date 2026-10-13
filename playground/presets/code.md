# 让复杂的内容，清晰一点

行内公式 $E = mc^2$、代码 `const answer = 42` 和普通文字可以在同一个选区里。阅读技术材料时，我们经常需要在推导、程序和解释之间来回移动。下面用一个很小的例子，把这些不同的表达方式放到同一篇文章中。

## 从一个函数开始

设 $f(x)=x^2$。在区间 $[0,1]$ 上，函数的定积分可以直接求得：

$$
\int_0^1 x^2 \, dx = \left[\frac{x^3}{3}\right]_0^1 = \frac{1}{3}.
$$

这个结果既是解析计算的答案，也可以成为验证数值程序的参照。我们并不需要让程序“证明”积分公式；只需要比较离散近似与已知结果之间的差异，理解步长如何影响误差。

## 离散化与梯形法

把区间等分为 $n$ 份，令 $h=(b-a)/n$，并记 $x_i=a+ih$。梯形公式将曲线下的面积近似为一组梯形面积之和：

$$
T_n = h\left[\frac{f(a)+f(b)}{2}+\sum_{i=1}^{n-1}f(x_i)\right].
$$

边界的两个函数值只计算一半。这个细节很适合添加一条脚注：每个内部采样点同时属于相邻的两个梯形，而左右端点各自只属于一个梯形。

```typescript
function integrate(
  f: (x: number) => number,
  a: number,
  b: number,
  steps = 100,
): number {
  if (!Number.isInteger(steps) || steps < 1) {
    throw new RangeError('steps must be a positive integer');
  }
  const width = (b - a) / steps;
  let sum = (f(a) + f(b)) / 2;
  for (let index = 1; index < steps; index++) {
    sum += f(a + index * width);
  }
  return sum * width;
}

const estimate = integrate(x => x * x, 0, 1, 100);
console.log({ estimate, error: Math.abs(estimate - 1 / 3) });
```

可以只选中循环里的表达式，也可以从上一段说明一直选到代码中的某一行。复制动作保留你实际看到的文字；高亮与批注则绑定对应的原文范围。

## 用误差理解结果

对 $f(x)=x^2$ 而言，这个区间上的梯形公式误差是 $1/(6n^2)$。把采样数翻倍，误差大约缩小到原来的四分之一。表格中的小数只是为了阅读方便而截取，程序内部仍然使用浮点数计算。

| 采样数 $n$ | 近似积分 $T_n$ | 绝对误差 |
| ---: | ---: | ---: |
| 10 | 0.33500000 | 0.00166667 |
| 20 | 0.33375000 | 0.00041667 |
| 100 | 0.33335000 | 0.00001667 |
| 200 | 0.33333750 | 0.00000417 |

> 验证一个数值结果时，先问误差是如何随输入变化的，再问屏幕上打印了多少位小数。

如果你想给这一点留下一个问题，可以选中“误差大约缩小到原来的四分之一”，点击「提问」，再写下：当函数不够光滑时，同样的规律还会成立吗？

## 一个更一般的表达

在许多问题中，我们需要同时处理一组参数。设参数向量为 $\theta$，损失函数为 $L(\theta)$，梯度下降的一步更新写作：

$$
\theta_{t+1}=\theta_t-\eta\nabla L(\theta_t).
$$

其中 $\eta$ 是步长。符号看起来很紧凑，但它包含几个独立的决定：如何定义损失，如何计算梯度，如何选择步长，以及什么时候停止更新。分别给这些决定添加笔记，比在公式旁写一大段混合说明更容易重新阅读。

```python
from collections.abc import Callable

def descend(gradient: Callable[[float], float], start: float,
            rate: float = 0.1, iterations: int = 20) -> list[float]:
    values = [start]
    for _ in range(iterations):
        values.append(values[-1] - rate * gradient(values[-1]))
    return values

# L(x) = (x - 3)^2, so its derivative is 2(x - 3).
trajectory = descend(lambda x: 2 * (x - 3), start=0)
print(trajectory[-1])
```

## 在阅读器中保留这些关系

一个阅读界面需要同时照顾连续阅读与局部操作。代码、公式和表格属于文章的论证，旁注与高亮属于读者的理解过程。两者放在同一个坐标系统里，才容易在以后重新找到关联。

```tsx
import { Reader } from 'limr';
import { useState } from 'react';
import type { Annotation } from 'limr';

export function ReadingRoom({ source }: { source: string }) {
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  return <Reader source={source}
    annotations={annotations}
    onAnnotationsChange={setAnnotations}
  />;
}
```

## 阅读检查表

- [ ] 给公式中的一个条件添加脚注。
- [ ] 在同一段代码上保留笔记和提问。
- [ ] 为代码中的局部表达式设置下划线。
- [ ] 检查复制后的文本是否保留符号与空格。
- [ ] 调整窗口宽度，观察表格与批注如何适应空间。

## 从答案回到假设

技术阅读最容易漏掉的部分，往往是“这个方法在什么条件下有用”。返回开头的积分例子：等距采样是否必要？函数在区间内是否连续？计算每个采样值的代价是否相同？如果把区间反过来，结果的符号又会如何变化？这些问题能够把一个已经算完的例子，变成下一次探索的起点。
