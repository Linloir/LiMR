# The Building Blocks of Interpretability

Chris Olah, Arvind Satyanarayan, Ian Johnson, Shan Carter, Ludwig Schubert, Katherine Ye, Alexander Mordvintsev · **Distill, 2018**

> A reading edition of selected passages and original illustrations, with Chinese translations written for this example and adapted figure notes. [Full paper and interactive figures](https://distill.pub/2018/building-blocks/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The English text and images are © their original authors. The static illustrations here do not reproduce the original site’s interactions.

## 1. Composable explanations

<translations default="origin">

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

![Activation visualization, PCA of activations, and the corresponding visual basis](./papers/building-activation.png)

<figcaption>

**Figure 1 · An overview through dimensionality reduction.** The left panel visualizes activations at spatial positions. The middle panel encodes activations using PCA components, and the right panel illustrates what those directions represent. The original text and images are preserved in full. © Olah et al., CC BY 4.0.

</figcaption>

</figure>

## 3. Choosing a basis

<translations default="origin">

<origin>

While we introduce semantic dictionaries in terms of neurons, they can be used with any basis of activations. We will explore this more later.

</origin>

<translation>

虽然我们以神经元为单位介绍语义字典，但它也可以用于激活空间的任意一组基底。后文将进一步讨论这一点。

</translation>

</translations>

<figure id="bb-basis" src="./papers/building-vector.png" alt="The same activation vector expressed in principal-component and neuron bases" max-width="none" max-height="240" caption="Figure 2 · The same activation vector can be expressed using principal components or neurons as a basis. Different visual vocabularies emphasize different structures. © the original authors, CC BY 4.0." />

Read [Figure 1](#bb-pca) alongside [Figure 2](#bb-basis): color condenses high-dimensional information, while the visualized basis helps explain what those colors represent.

## 4. Attribution between layers

<translations default="origin">

<origin>

An alternate way to slice the cube is by channels instead of spatial locations. Doing so allows us to perform channel attribution: how much did each detector contribute to the final output?

</origin>

<translation>

另一种切分这个立方体的方式，是按通道，而不是按空间位置切分。这样就能进行通道归因：每个检测器对最终输出贡献了多少？

</translation>

</translations>

<figure id="bb-attribution" src="./papers/building-attribution.png" alt="Channel attribution across hidden layers" max-width="none" max-height="380">

<figcaption>

**Figure 3 · Channel attribution.** Visual symbols from semantic dictionaries show channels and their contributions. The original site supports hover interactions and layer-by-layer exploration; this example preserves the original static image. © the original authors, CC BY 4.0.

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

<question title="Why combine interpretability methods?">

<question-content>Which statement best reflects how to interpret these images?</question-content>

<question-sel-grp answer="[1]">

<question-sel>Giving every neuron a name fully explains the model.</question-sel>
<question-sel>Combining visualization, attribution, and dimensionality reduction lets us ask complementary questions at different scales.</question-sel>

</question-sel-grp>

<question-hint>Consider what each method preserves, aggregates, or leaves out.</question-hint>
<question-answer>The second statement is more appropriate. The paper explores composable methods and the interfaces built from them; every form of aggregation involves trade-offs.</question-answer>

</question>

## References

1. Olah et al. *The Building Blocks of Interpretability*. Distill (2018).<ref id="bb-paper" />
2. Olah, Mordvintsev & Schubert. *Feature Visualization*. Distill (2017).<ref id="bb-feature" />

<citation id="bb-paper" title="The Building Blocks of Interpretability" url="https://distill.pub/2018/building-blocks/" summary="Semantic dictionaries, attribution through hidden layers, and interpretability interfaces at a human scale." description="Chris Olah et al. **Distill**, 2018. DOI: 10.23915/distill.00010. The English excerpts and illustrations in this example come from the original paper and are used under CC BY 4.0." />

<citation id="bb-feature" title="Feature Visualization" url="https://distill.pub/2017/feature-visualization/" summary="Using optimized images to understand the features a model looks for." description="Chris Olah, Alexander Mordvintsev, Ludwig Schubert. **Distill**, 2017. DOI: 10.23915/distill.00007." />
