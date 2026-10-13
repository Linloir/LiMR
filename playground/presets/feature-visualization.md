# Feature Visualization · 特征可视化

Chris Olah, Alexander Mordvintsev, Ludwig Schubert · **Distill, 2017**

> 原论文的选段与插图重排，中文为本示例新译；图注中的读图说明由本示例补充。英文与图片 © 原作者，按 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 署名使用。[完整论文](https://distill.pub/2017/feature-visualization/)包含交互演示与完整参考文献。

## 1. Seeing what a network looks for

<translations default="both">

<origin>

There is a growing sense that neural networks need to be interpretable to humans. The field of neural network interpretability has formed in response to these concerns. As it matures, two major threads of research have begun to coalesce: feature visualization and attribution.<ref id="fv-paper" />

</origin>

<translation>

人们越来越认识到，神经网络需要能够被人类理解。神经网络可解释性研究正是回应这些关切而形成的。随着这一领域逐渐成熟，两条主要研究方向开始汇聚：**特征可视化**与**归因**。<ref id="fv-paper" />

</translation>

</translations>

<definition title="特征可视化与归因">

特征可视化通过生成例子，研究网络或网络的一部分在寻找什么；归因则研究一个给定例子的哪些部分促成了网络的某种响应。二者回答的问题不同，可以结合使用。

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

下面的[图 1](#fv-objectives)比较单个神经元与整个通道的优化目标。图像来自原论文，不是自然照片，也不是分类模型对某个类别的完整定义。

<figures id="fv-objectives" min-width="160" max-width="240" min-height="120" max-height="240">

<figure src="./papers/feature-neuron.png" alt="针对单个神经元优化的图像" caption="(a) Neuron：固定空间位置与通道。" />

<figure src="./papers/feature-channel.png" alt="针对整个通道优化的图像" caption="(b) Channel：跨空间位置优化通道响应。" />

<figcaption>

**图 1 · 两种优化目标。** 单神经元目标与通道目标可以产生不同的图像结构。原论文使用 GoogLeNet 展示这些方法。© Olah、Mordvintsev、Schubert，CC BY 4.0。

</figcaption>

</figures>

<translations default="translation">

<origin>

If we want to understand individual features, we can search for examples where they have high values—either for a neuron at an individual position, or for an entire channel. We used the channel objective to create most of the images in this article.

</origin>

<translation>

如果想理解单个特征，我们可以寻找使其响应较高的例子：既可以针对某个空间位置上的神经元，也可以针对整个通道。本文大多数图像都采用通道目标生成。

</translation>

</translations>

用简化的记号表示，寻找高响应输入可以写成：

$$
x^* = \operatorname*{arg\,max}_{x} a_c(x)
$$

这里的公式是阅读提示：$a_c$ 表示所选目标的激活值。实际生成质量还与参数化和正则化有关。

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

<figure src="./papers/feature-optimized.png" alt="mixed4a 通道 97 的一次优化结果" max-width="220" caption="(a) 单次优化得到的一种表现。" />

<figure src="./papers/feature-diversity.png" alt="mixed4a 通道 97 加入多样性目标后的四种结果" caption="(b) 多样性优化揭示四种弯曲结构。" />

<figcaption>

**图 2 · 同一通道的不同侧面。** GoogLeNet，mixed4a，unit 97。固定双栏便于比较，窄屏会按图片的最小可读尺寸回到单栏；所有图片保留原始比例。© 原作者，CC BY 4.0。

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

<citation id="fv-paper" title="Feature Visualization" url="https://distill.pub/2017/feature-visualization/" summary="优化目标、多样性、神经元交互、正则化与参数化。" description="Chris Olah, Alexander Mordvintsev, Ludwig Schubert. **Distill**, 2017. DOI: 10.23915/distill.00007。本文英文选段及全部插图的来源，CC BY 4.0。" />

<citation id="fv-followup" title="The Building Blocks of Interpretability" url="https://distill.pub/2018/building-blocks/" summary="将特征可视化、归因与降维组合成可解释性界面。" description="Olah et al. **Distill**, 2018. DOI: 10.23915/distill.00010。可在顶部“加载”菜单继续阅读其图文译读样例。" />
