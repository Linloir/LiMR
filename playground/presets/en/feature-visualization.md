# Feature Visualization

Chris Olah, Alexander Mordvintsev, Ludwig Schubert · **Distill, 2017**

> Selected passages and illustrations from the original paper, arranged for reading. Chinese translations and explanatory figure notes were written for this example. The English text and images are © their original authors and used with attribution under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The [full paper](https://distill.pub/2017/feature-visualization/) includes interactive demonstrations and the complete bibliography.

## 1. Seeing what a network looks for

<translations default="origin">

<origin>

There is a growing sense that neural networks need to be interpretable to humans. The field of neural network interpretability has formed in response to these concerns. As it matures, two major threads of research have begun to coalesce: feature visualization and attribution.<ref id="fv-paper" />

</origin>

<translation>

人们越来越认识到，神经网络需要能够被人类理解。神经网络可解释性研究正是回应这些关切而形成的。随着这一领域逐渐成熟，两条主要研究方向开始汇聚：**特征可视化**与**归因**。<ref id="fv-paper" />

</translation>

</translations>

<definition title="Feature visualization and attribution">

Feature visualization generates examples to explore what a network, or part of a network, looks for. Attribution asks which parts of a given example contribute to a particular response. The two methods answer different questions and can be used together.

</definition>

## 2. Optimization objectives

<translations default="origin">

<origin>

Neural networks are, generally speaking, differentiable with respect to their inputs. If we want to find out what kind of input would cause a certain behavior—whether that’s an internal neuron firing or the final output behavior—we can use derivatives to iteratively tweak the input towards that goal.

</origin>

<translation>

一般来说，神经网络相对于输入是可微的。如果想知道什么样的输入会引发某种行为——无论是内部神经元的激活，还是最终的输出——我们都可以利用导数，反复调整输入，使它逐步朝这个目标靠近。

</translation>

</translations>

[Figure 1](#fv-objectives) compares optimization objectives for a single neuron and an entire channel. These images come from the original paper; they are neither natural photographs nor complete definitions of a class learned by the model.

<figures id="fv-objectives" min-width="160" max-width="240" min-height="120" max-height="240">

<figure src="./papers/feature-neuron.png" alt="Image optimized for a single neuron" caption="(a) Neuron: a fixed spatial position and channel." />

<figure src="./papers/feature-channel.png" alt="Image optimized for an entire channel" caption="(b) Channel: optimize the channel response across spatial positions." />

<figcaption>

**Figure 1 · Two optimization objectives.** Neuron and channel objectives can produce different image structures. The original paper demonstrates these methods using GoogLeNet. © Olah, Mordvintsev, and Schubert, CC BY 4.0.

</figcaption>

</figures>

<translations default="origin">

<origin>

If we want to understand individual features, we can search for examples where they have high values—either for a neuron at an individual position, or for an entire channel. We used the channel objective to create most of the images in this article.

</origin>

<translation>

如果想理解单个特征，我们可以寻找使其响应较高的例子：既可以针对某个空间位置上的神经元，也可以针对整个通道。本文大多数图像都采用通道目标生成。

</translation>

</translations>

In simplified notation, searching for an input with a high response can be written as:

$$
x^* = \operatorname*{arg\,max}_{x} a_c(x)
$$

This equation is a reading aid: $a_c$ denotes the activation of the chosen objective. The quality of the generated image also depends on parameterization and regularization.

## 3. One example is not the whole feature

<translations default="origin">

<origin>

Do our examples show us the full picture? When we create examples by optimization, this is something we need to be very careful of. It’s entirely possible for genuine examples to still mislead us by only showing us one “facet” of what a feature represents.

</origin>

<translation>

这些例子展示了完整面貌吗？通过优化生成例子时，我们必须格外小心。即使例子本身真实有效，也可能只展示一个特征所代表事物的某个“侧面”，从而误导我们。

</translation>

</translations>

<figures id="fv-diversity" columns="2" rows="1" min-width="160" min-height="80" max-width="720" max-height="250">

<figure src="./papers/feature-optimized.png" alt="One optimization result for mixed4a channel 97" max-width="220" caption="(a) One facet found by a single optimization run." />

<figure src="./papers/feature-diversity.png" alt="Four results for mixed4a channel 97 with a diversity objective" caption="(b) Diversity optimization reveals four curved structures." />

<figcaption>

**Figure 2 · Different facets of the same channel.** GoogLeNet, mixed4a, unit 97. The two-column layout supports comparison and becomes a single column on narrow screens to keep the images readable. All images retain their original aspect ratios. © the original authors, CC BY 4.0.

</figcaption>

</figures>

<translations default="origin">

<origin>

Dataset examples have a big advantage here. By looking through our dataset, we can find diverse examples. It doesn’t just give us ones activating a neuron intensely: we can look across a whole spectrum of activations to see what activates the neuron to different extents.

</origin>

<translation>

数据集中的例子在这里具有很大优势。浏览数据集，可以找到多种多样的例子。它们不仅包括强烈激活某个神经元的输入：我们还可以沿着整个激活强度谱观察，了解哪些输入会让神经元产生不同程度的响应。

</translation>

</translations>

## 4. A building block, not a complete explanation

<translations default="origin">

<origin>

In the quest to make neural networks interpretable, feature visualization stands out as one of the most promising and developed research directions. By itself, feature visualization will never give a completely satisfactory understanding. We see it as one of the fundamental building blocks that, combined with additional tools, will empower humans to understand these systems.

</origin>

<translation>

在使神经网络可解释的探索中，特征可视化是最有前景、发展也最充分的研究方向之一。但仅靠特征可视化，永远无法得到完全令人满意的理解。我们把它看作一块基础积木：与其他工具结合，才有望帮助人们理解这些系统。

</translation>

</translations>

## References and further reading

1. Olah, Mordvintsev & Schubert. *Feature Visualization*. Distill (2017).<ref id="fv-paper" />
2. Olah et al. *The Building Blocks of Interpretability*. Distill (2018).<ref id="fv-followup" />

<citation id="fv-paper" title="Feature Visualization" url="https://distill.pub/2017/feature-visualization/" summary="Optimization objectives, diversity, interactions between neurons, regularization, and parameterization." description="Chris Olah, Alexander Mordvintsev, Ludwig Schubert. **Distill**, 2017. DOI: 10.23915/distill.00007. Source of the English excerpts and all illustrations in this example, CC BY 4.0." />

<citation id="fv-followup" title="The Building Blocks of Interpretability" url="https://distill.pub/2018/building-blocks/" summary="Combining feature visualization, attribution, and dimensionality reduction into interpretability interfaces." description="Olah et al. **Distill**, 2018. DOI: 10.23915/distill.00010. Open its illustrated bilingual example from the Load menu at the top." />
