# The Building Blocks of Interpretability

Chris Olah, Arvind Satyanarayan, Ian Johnson, Shan Carter, Ludwig Schubert, Katherine Ye, Alexander Mordvintsev · **Distill, 2018**

> 原论文选段与原始插图的阅读版，中文为本示例新译，图注说明经整理。[完整论文及交互图](https://distill.pub/2018/building-blocks/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。英文与图片 © 原作者。这里的静态插图不复现原站的交互操作。

## 1. Composable explanations

<translations default="both">

<origin>

In this article, we treat existing interpretability methods as fundamental and composable building blocks for rich user interfaces. We find that these disparate techniques now come together in a unified grammar, fulfilling complementary roles in the resulting interfaces. Moreover, this grammar allows us to systematically explore the space of interpretability interfaces, enabling us to evaluate whether they meet particular goals.<ref id="bb-paper" />

</origin>

<translation>

在本文中，我们把已有的可解释性方法视为构建丰富用户界面的基础积木，并让它们能够相互组合。这些不同的技术可以形成统一的语法，在界面中承担互补的角色。这样的语法还让我们能够系统地探索可解释性界面的设计空间，判断它们是否满足特定目标。<ref id="bb-paper" />

</translation>

</translations>

## 2. Giving meaning to hidden layers

<translations default="origin">

<origin>

However, the power of neural networks lies in their hidden layers—at every layer, the network discovers a new representation of the input. In computer vision, we use neural networks that run the same feature detectors at every position in the image. We can think of each layer’s learned representation as a three-dimensional cube. Each cell in the cube is an activation, or the amount a neuron fires.

</origin>

<translation>

然而，神经网络的力量在于隐藏层：在每一层，网络都为输入找到一种新的表示。在计算机视觉中，同一组特征检测器会在图像的各个位置运行。因此，每一层学到的表示可以看作一个三维立方体，其中每个单元都是一个激活值，也就是某个神经元的响应强度。

</translation>

</translations>

<translations default="origin">

<origin>

To make a semantic dictionary, we pair every neuron activation with a visualization of that neuron and sort them by the magnitude of the activation. This marriage of activations and feature visualization changes our relationship with the underlying mathematical object. Activations now map to iconic representations, instead of abstract indices, with many appearing to be similar to salient human ideas, such as “floppy ear,” “dog snout,” or “fur.”

</origin>

<translation>

构建语义字典时，我们把每个神经元的激活与它的可视化结果配对，再按激活强度排序。激活值与特征可视化的结合，改变了我们理解底层数学对象的方式。激活现在对应形象的视觉符号，而不只是抽象索引；其中许多看起来接近人类熟悉的概念，例如“垂耳”“狗鼻子”或“毛皮”。

</translation>

</translations>

<figure id="bb-pca" max-width="none" max-height="360">

![激活可视化、激活 PCA 与对应视觉基底](/papers/building-activation.png)

<figcaption>

**图 1 · 通过降维获得概览。** 左侧显示空间位置上的激活可视化，中间用 PCA 的分量编码激活，右侧用可视化图像解释这些方向。原图文字和图像完整保留；© Olah et al.，CC BY 4.0。

</figcaption>

</figure>

## 3. Choosing a basis

<translations default="translation">

<origin>

While we introduce semantic dictionaries in terms of neurons, they can be used with any basis of activations. We will explore this more later.

</origin>

<translation>

虽然我们以神经元为单位介绍语义字典，但它也可以用于激活空间的任意一组基底。后文将进一步讨论这一点。

</translation>

</translations>

<figure id="bb-basis" src="/papers/building-vector.png" alt="同一个激活向量分别用主成分与神经元表示" max-width="none" max-height="240" caption="图 2 · 同一激活向量可以用主成分或神经元作为基底表示；不同的视觉词汇强调不同结构。© 原作者，CC BY 4.0。" />

读图时可以把[图 1](#bb-pca)和[图 2](#bb-basis)联系起来：颜色压缩了高维信息，可视化基底则帮助读者理解这些颜色代表什么。

## 4. Attribution between layers

<translations default="origin">

<origin>

An alternate way to slice the cube is by channels instead of spatial locations. Doing so allows us to perform channel attribution: how much did each detector contribute to the final output?

</origin>

<translation>

另一种切分这个立方体的方式，是按通道，而不是按空间位置切分。这样就能进行通道归因：每个检测器对最终输出贡献了多少？

</translation>

</translations>

<figure id="bb-attribution" src="/papers/building-attribution.png" alt="跨隐藏层的通道归因图" max-width="none" max-height="380">

<figcaption>

**图 3 · 通道归因。** 用语义字典中的视觉符号呈现通道及其贡献关系。原站支持悬浮和逐层探索；这里保留原始静态图。© 原作者，CC BY 4.0。

</figcaption>

</figure>

## 5. Keeping explanations human-scale

<translations default="origin">

<origin>

If we want to make useful interfaces into neural networks, it isn’t enough to make things meaningful. We need to make them human scale, rather than overwhelming dumps of information. The key to doing so is finding more meaningful ways of breaking up our activations. There is good reason to believe that such decompositions exist. Often, many channels or spatial positions will work together in a highly correlated way and are most useful to think of as one unit.

</origin>

<translation>

如果想为神经网络构建有用的界面，仅让信息具有意义还不够。我们需要把信息控制在人能够理解的尺度，而不是把海量信息一股脑倾倒出来。关键在于找到更有意义的激活分解方式。我们有理由相信这种分解存在：许多通道或空间位置往往高度相关地协同工作，将它们作为一个整体来理解更有用。

</translation>

</translations>

<question title="为什么需要组合解释方法？">

<question-content>理解这些图像时，哪一种判断更合适？</question-content>

<question-sel-grp answer="[1]">

<question-sel>给每个神经元起一个名称，就完整解释了模型。</question-sel>
<question-sel>把可视化、归因和降维结合起来，可以在不同尺度上提出互补的问题。</question-sel>

</question-sel-grp>

<question-hint>想一想每种方法保留了什么、又聚合或丢失了什么。</question-hint>
<question-answer>第二项更合适。论文讨论的是可组合的方法及其界面设计；每种聚合都存在取舍。</question-answer>

</question>

## References

1. Olah et al. *The Building Blocks of Interpretability*. Distill (2018).<ref id="bb-paper" />
2. Olah, Mordvintsev & Schubert. *Feature Visualization*. Distill (2017).<ref id="bb-feature" />

<citation id="bb-paper" title="The Building Blocks of Interpretability" url="https://distill.pub/2018/building-blocks/" summary="语义字典、隐藏层归因与面向人类尺度的解释界面。" description="Chris Olah et al. **Distill**, 2018. DOI: 10.23915/distill.00010。本文英文选段与插图均来自原文，按 CC BY 4.0 使用。" />

<citation id="bb-feature" title="Feature Visualization" url="https://distill.pub/2017/feature-visualization/" summary="以优化得到的图像理解模型寻找的特征。" description="Chris Olah, Alexander Mordvintsev, Ludwig Schubert. **Distill**, 2017. DOI: 10.23915/distill.00007。" />
