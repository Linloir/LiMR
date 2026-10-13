# Scikit-learn: Machine Learning in Python

Fabian Pedregosa, Gaël Varoquaux, Alexandre Gramfort, Vincent Michel, Bertrand Thirion, Olivier Grisel, Mathieu Blondel, Peter Prettenhofer, Ron Weiss, Vincent Dubourg, Jake Vanderplas, Alexandre Passos, David Cournapeau, Matthieu Brucher, Matthieu Perrot, Édouard Duchesnay

*Journal of Machine Learning Research*, 12, 2825–2830 (2011). Editor: Mikio Braun.

> [原论文及书目信息](https://jmlr.org/papers/v12/pedregosa11a.html) · [原版 PDF](https://jmlr.org/papers/volume12/pedregosa11a/pedregosa11a.pdf)。本文是原论文摘要、正文、表格和参考文献的 Markdown 转写；省略通信地址、页眉页脚，合并 PDF 的断行。数字与版本均保留 2011 年原文语境。摘要、项目愿景、基础技术与结论附有本示例新译的中文，可逐段切换。© 2011 作者；按 [JMLR 的 CC BY 出版政策](https://jmlr.org/author-info.html#publication)署名转载。

## Abstract

<translations default="origin">

<origin>

Scikit-learn is a Python module integrating a wide range of state-of-the-art machine learning algorithms for medium-scale supervised and unsupervised problems. This package focuses on bringing machine learning to non-specialists using a general-purpose high-level language. Emphasis is put on ease of use, performance, documentation, and API consistency. It has minimal dependencies and is distributed under the simplified BSD license, encouraging its use in both academic and commercial settings. Source code, binaries, and documentation can be downloaded from http://scikit-learn.sourceforge.net.

</origin>

<translation>

Scikit-learn 是一个 Python 模块，集成了多种先进的机器学习算法，适用于中等规模的有监督和无监督问题。这个软件包侧重于让非专业人士也能接触机器学习，使用 Python 这样的通用高级语言。它强调易用性、性能、文档以及 API 的一致性，依赖很少，并采用简化的 BSD 许可证，鼓励学术和商业使用。源码、二进制包与文档可从 http://scikit-learn.sourceforge.net 获取。

</translation>

</translations>

**Keywords:** Python, supervised learning, unsupervised learning, model selection

## 1. Introduction

The Python programming language is establishing itself as one of the most popular languages for scientific computing. Thanks to its high-level interactive nature and its maturing ecosystem of scientific libraries, it is an appealing choice for algorithmic development and exploratory data analysis (Dubois, 2007; Milmann and Avaizis, 2011)<ref ids="sk-2,sk-9" />. Yet, as a general-purpose language, it is increasingly used not only in academic settings but also in industry. Scikit-learn harnesses this rich environment to provide state-of-the-art implementations of many well known machine learning algorithms, while maintaining an easy-to-use interface tightly integrated with the Python language. This answers the growing need for statistical data analysis by non-specialists in the software and web industries, as well as in fields outside of computer-science, such as biology or physics. Scikit-learn differs from other machine learning toolboxes in Python for various reasons: i) it is distributed under the BSD license ii) it incorporates compiled code for efficiency, unlike MDP (Zito et al., 2008)<ref id="sk-15" /> and pybrain (Schaul et al., 2010)<ref id="sk-12" />, iii) it depends only on numpy and scipy to facilitate easy distribution, unlike pymvpa (Hanke et al., 2009)<ref id="sk-6" /> that has optional dependencies such as R and shogun, and iv) it focuses on imperative programming, unlike pybrain which uses a data-flow framework. While the package is mostly written in Python, it incorporates the C++ libraries LibSVM (Chang and Lin, 2001)<ref id="sk-1" /> and LibLinear (Fan et al., 2008)<ref id="sk-3" /> that provide reference implementations of SVMs and generalized linear models with compatible licenses. Binary packages are available on a rich set of platforms including Windows and any POSIX platforms.

Furthermore, thanks to its liberal license, it has been widely distributed as part of major free software distributions such as Ubuntu, Debian, Mandriva, NetBSD and Macports and in commercial distributions such as the “Enthought Python Distribution”.

## 2. Project Vision

<translations default="origin">

<origin>

**Code quality.** Rather than providing as many features as possible, the project’s goal has been to provide solid implementations. Code quality is ensured with unit tests—as of release 0.8, test coverage is 81%—and the use of static analysis tools such as pyflakes and pep8. Finally, we strive to use consistent naming for the functions and parameters used throughout a strict adherence to the Python coding guidelines and numpy style documentation.

</origin>

<translation>

**代码质量。** 项目的目标是提供扎实的实现，而不是尽可能堆叠功能。单元测试以及 pyflakes、pep8 等静态分析工具保障代码质量；在 0.8 版本中，测试覆盖率达到 81%。项目还力求统一函数与参数的命名，遵循 Python 编码规范和 NumPy 风格的文档约定。

</translation>

</translations>

<translations default="origin">

<origin>

**BSD licensing.** Most of the Python ecosystem is licensed with non-copyleft licenses. While such policy is beneficial for adoption of these tools by commercial projects, it does impose some restrictions: we are unable to use some existing scientific code, such as the GSL.

</origin>

<translation>

**BSD 许可。** Python 生态中的大多数软件采用非 copyleft 许可证。这有利于商业项目采用这些工具，但也带来限制：项目无法使用某些已有的科学计算代码，例如 GSL。

</translation>

</translations>

<translations default="origin">

<origin>

**Bare-bone design and API.** To lower the barrier of entry, we avoid framework code and keep the number of different objects to a minimum, relying on numpy arrays for data containers.

</origin>

<translation>

**精简设计与 API。** 为了降低使用门槛，我们避免引入框架式代码，尽量减少不同对象的数量，并以 NumPy 数组作为数据容器。

</translation>

</translations>

<translations default="origin">

<origin>

**Community-driven development.** We base our development on collaborative tools such as git, github and public mailing lists. External contributions are welcome and encouraged.

</origin>

<translation>

**社区驱动的开发。** 项目依托 Git、GitHub 和公开邮件列表等协作工具进行开发，欢迎并鼓励外部贡献。

</translation>

</translations>

<translations default="origin">

<origin>

**Documentation.** Scikit-learn provides a ∼300 page user guide including narrative documentation, class references, a tutorial, installation instructions, as well as more than 60 examples, some featuring real-world applications. We try to minimize the use of machine-learning jargon, while maintaining precision with regards to the algorithms employed.

</origin>

<translation>

**文档。** 当时的 scikit-learn 提供约 300 页用户指南，包含说明性文档、类参考、教程、安装说明和 60 多个示例，其中部分来自真实应用。项目尽量减少机器学习术语，同时准确介绍所用算法。

</translation>

</translations>

## 3. Underlying Technologies

<translations default="origin">

<origin>

**Numpy:** the base data structure used for data and model parameters. Input data is presented as numpy arrays, thus integrating seamlessly with other scientific Python libraries. Numpy’s view-based memory model limits copies, even when binding with compiled code (Van der Walt et al., 2011)<ref id="sk-14" />. It also provides basic arithmetic operations.

</origin>

<translation>

**NumPy：** 用于存放数据和模型参数的基础数据结构。输入数据采用 NumPy 数组，因此可以与其他科学 Python 库无缝结合。NumPy 基于视图的内存模型减少了复制，即使与编译代码绑定时也是如此。它还提供基本算术操作。

</translation>

</translations>

<translations default="origin">

<origin>

**Scipy:** efficient algorithms for linear algebra, sparse matrix representation, special functions and basic statistical functions. Scipy has bindings for many Fortran-based standard numerical packages, such as LAPACK. This is important for ease of installation and portability, as providing libraries around Fortran code can prove challenging on various platforms.

</origin>

<translation>

**SciPy：** 提供高效的线性代数算法、稀疏矩阵表示、特殊函数和基础统计函数，并为 LAPACK 等许多以 Fortran 编写的标准数值计算包提供绑定。这有助于安装和移植，因为围绕 Fortran 代码提供跨平台软件库往往并不容易。

</translation>

</translations>

<translations default="origin">

<origin>

**Cython:** a language for combining C in Python. Cython makes it easy to reach the performance of compiled languages with Python-like syntax and high-level operations. It is also used to bind compiled libraries, eliminating the boilerplate code of Python/C extensions.

</origin>

<translation>

**Cython：** 一种在 Python 中结合 C 的语言。它保留类似 Python 的语法和高级操作，同时便于达到编译语言的性能；它也用于绑定已编译的软件库，减少编写 Python/C 扩展时的样板代码。

</translation>

</translations>

## 4. Code Design

**Objects specified by interface, not by inheritance.** To facilitate the use of external objects with scikit-learn, inheritance is not enforced; instead, code conventions provide a consistent interface. The central object is an estimator, that implements a fit method, accepting as arguments an input data array and, optionally, an array of labels for supervised problems. Supervised estimators, such as SVM classifiers, can implement a predict method. Some estimators, that we call transformers, for example, PCA, implement a transform method, returning modified input data. Estimators may also provide a score method, which is an increasing evaluation of goodness of fit: a log-likelihood, or a negated loss function. The other important object is the cross-validation iterator, which provides pairs of train and test indices to split input data, for example K-fold, leave one out, or stratified cross-validation.

**Model selection.** Scikit-learn can evaluate an estimator’s performance or select parameters using cross-validation, optionally distributing the computation to several cores. This is accomplished by wrapping an estimator in a GridSearchCV object, where the “CV” stands for “cross-validated”. During the call to fit, it selects the parameters on a specified parameter grid, maximizing a score (the score method of the underlying estimator). predict, score, or transform are then delegated to the tuned estimator. This object can therefore be used transparently as any other estimator. Cross validation can be made more efficient for certain estimators by exploiting specific properties, such as warm restarts or regularization paths (Friedman et al., 2010)<ref id="sk-4" />. This is supported through special objects, such as the LassoCV. Finally, a Pipeline object can combine several transformers and an estimator to create a combined estimator to, for example, apply dimension reduction before fitting. It behaves as a standard estimator, and GridSearchCV therefore tune the parameters of all steps.

| Algorithm | scikit-learn | mlpy | pybrain | pymvpa | mdp | shogun |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Support Vector Classification | 5.2 | 9.47 | 17.5 | 11.52 | 40.48 | 5.63 |
| Lasso (LARS) | 1.17 | 105.3 | — | 37.35 | — | — |
| Elastic Net | 0.52 | 73.7 | — | 1.44 | — | — |
| k-Nearest Neighbors | 0.57 | 1.41 | — | 0.56 | 0.58 | 1.36 |
| PCA (9 components) | 0.18 | — | — | 8.93 | 0.47 | 0.33 |
| k-Means (9 clusters) | 1.34 | 0.79 | ⋆ | — | 35.75 | 0.68 |
| License | BSD | GPL | BSD | BSD | BSD | GPL |

—: Not implemented. ⋆: Does not converge within 1 hour.

**Table 1.** Time in seconds on the Madelon data set for various machine learning libraries exposed in Python: MLPy (Albanese et al., 2008)<ref id="sk-0" />, PyBrain (Schaul et al., 2010)<ref id="sk-12" />, pymvpa (Hanke et al., 2009)<ref id="sk-6" />, MDP (Zito et al., 2008)<ref id="sk-15" /> and Shogun (Sonnenburg et al., 2010)<ref id="sk-13" />. For more benchmarks see http://github.com/scikit-learn.

## 5. High-level yet Efficient: Some Trade Offs

While scikit-learn focuses on ease of use, and is mostly written in a high level language, care has been taken to maximize computational efficiency. In Table 1, we compare computation time for a few algorithms implemented in the major machine learning toolkits accessible in Python. We use the Madelon data set (Guyon et al., 2004)<ref id="sk-5" />, 4400 instances and 500 attributes, The data set is quite large, but small enough for most algorithms to run.

**SVM.** While all of the packages compared call libsvm in the background, the performance of scikit-learn can be explained by two factors. First, our bindings avoid memory copies and have up to 40% less overhead than the original libsvm Python bindings. Second, we patch libsvm to improve efficiency on dense data, use a smaller memory footprint, and better use memory alignment and pipelining capabilities of modern processors. This patched version also provides unique features, such as setting weights for individual samples.

**LARS.** Iteratively refining the residuals instead of recomputing them gives performance gains of 2–10 times over the reference R implementation (Hastie and Efron, 2004)<ref id="sk-7" />. Pymvpa uses this implementation via the Rpy R bindings and pays a heavy price to memory copies.

**Elastic Net.** We benchmarked the scikit-learn coordinate descent implementations of Elastic Net. It achieves the same order of performance as the highly optimized Fortran version glmnet (Friedman et al., 2010)<ref id="sk-4" /> on medium-scale problems, but performance on very large problems is limited since we do not use the KKT conditions to define an active set.

**kNN.** The k-nearest neighbors classifier implementation constructs a ball tree (Omohundro, 1989)<ref id="sk-10" /> of the samples, but uses a more efficient brute force search in large dimensions.

**PCA.** For medium to large data sets, scikit-learn provides an implementation of a truncated PCA based on random projections (Rokhlin et al., 2009)<ref id="sk-11" />.

**k-means.** scikit-learn’s k-means algorithm is implemented in pure Python. Its performance is limited by the fact that numpy’s array operations take multiple passes over data.

## 6. Conclusion

<translations default="origin">

<origin>

Scikit-learn exposes a wide variety of machine learning algorithms, both supervised and unsupervised, using a consistent, task-oriented interface, thus enabling easy comparison of methods for a given application. Since it relies on the scientific Python ecosystem, it can easily be integrated into applications outside the traditional range of statistical data analysis. Importantly, the algorithms, implemented in a high-level language, can be used as building blocks for approaches specific to a use case, for example, in medical imaging (Michel et al., 2011)<ref id="sk-8" />. Future work includes online learning, to scale to large data sets.

</origin>

<translation>

Scikit-learn 通过一致、面向任务的接口，提供多种有监督和无监督机器学习算法，让用户容易比较不同方法在某个应用中的表现。它依托科学 Python 生态，可以方便地集成到传统统计分析之外的应用中。这些使用高级语言实现的算法，也可以作为针对特定用途的方法的组成部分，例如医学影像。论文当时提出的未来工作包括在线学习，以扩展到大规模数据集。

</translation>

</translations>

## References

1. D. Albanese, G. Merler, S.and Jurman, and R. Visintainer. MLPy: high-performance python package for predictive modeling. In NIPS, MLOSS Workshop, 2008.<ref id="sk-0" />

2. C.C. Chang and C.J. Lin. LIBSVM: a library for support vector machines. http://www.csie. ntu.edu.tw/cjlin/libsvm, 2001.<ref id="sk-1" />

3. P.F. Dubois, editor. Python: Batteries Included, volume 9 of Computing in Science & Engineering. IEEE/AIP, May 2007.<ref id="sk-2" />

4. R.E. Fan, K.W. Chang, C.J. Hsieh, X.R. Wang, and C.J. Lin. LIBLINEAR: a library for large linear classification. The Journal of Machine Learning Research, 9:1871–1874, 2008.<ref id="sk-3" />

5. J. Friedman, T. Hastie, and R. Tibshirani. Regularization paths for generalized linear models via coordinate descent. Journal of Statistical Software, 33(1):1, 2010.<ref id="sk-4" />

6. I Guyon, S. R. Gunn, A. Ben-Hur, and G. Dror. Result analysis of the NIPS 2003 feature selection challenge, 2004.<ref id="sk-5" />

7. M. Hanke, Y.O. Halchenko, P.B. Sederberg, S.J. Hanson, J.V. Haxby, and S. Pollmann. PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data. Neuroinformatics, 7(1):37–53, 2009.<ref id="sk-6" />

8. T. Hastie and B. Efron. Least Angle Regression, Lasso and Forward Stagewise. http://cran. r-project.org/web/packages/lars/lars.pdf, 2004.<ref id="sk-7" />

9. V. Michel, A. Gramfort, G. Varoquaux, E. Eger, C. Keribin, and B. Thirion. A supervised clustering approach for fMRI-based inference of brain states. Patt Rec, page epub ahead of print, April 2011. doi: 10.1016/j.patcog.2011.04.006.<ref id="sk-8" />

10. K.J. Millman and M. Avaizis, editors. Scientific Python, volume 11 of Computing in Science & Engineering. IEEE/AIP, March 2011.<ref id="sk-9" />

11. S.M. Omohundro. Five balltree construction algorithms. ICSI Technical Report TR-89-063, 1989.<ref id="sk-10" />

12. V. Rokhlin, A. Szlam, and M. Tygert. A randomized algorithm for principal component analysis. SIAM Journal on Matrix Analysis and Applications, 31(3):1100–1124, 2009.<ref id="sk-11" />

13. T. Schaul, J. Bayer, D. Wierstra, Y. Sun, M. Felder, F. Sehnke, T. Rückstieß, and J. Schmidhuber. PyBrain. The Journal of Machine Learning Research, 11:743–746, 2010.<ref id="sk-12" />

14. S. Sonnenburg, G. Rätsch, S. Henschel, C. Widmer, J. Behr, A. Zien, F. de Bona, A. Binder, C. Gehl, and V. Franc. The SHOGUN machine learning toolbox. Journal of Machine Learning Research, 11:1799–1802, 2010.<ref id="sk-13" />

15. S. Van der Walt, S.C Colbert, and G. Varoquaux. The NumPy array: A structure for efficient numerical computation. Computing in Science and Engineering, 11, 2011.<ref id="sk-14" />

16. T. Zito, N. Wilbert, L. Wiskott, and P. Berkes. Modular toolkit for data processing (MDP): A Python data processing framework. Frontiers in Neuroinformatics, 2, 2008.<ref id="sk-15" />

<citation id="sk-0" title="MLPy: high-performance Python package for predictive modeling" summary="D. Albanese, G. Merler, S.and Jurman, and R. Visintainer. MLPy: high-performance python package for predictive modeling. In NIPS, MLOSS Workshop, 2008." description="D. Albanese, G. Merler, S.and Jurman, and R. Visintainer. MLPy: high-performance python package for predictive modeling. In NIPS, MLOSS Workshop, 2008." />

<citation id="sk-1" title="LIBSVM: a library for support vector machines" summary="C.C. Chang and C.J. Lin. LIBSVM: a library for support vector machines. http://www.csie. ntu.edu.tw/cjlin/libsvm, 2001." description="C.C. Chang and C.J. Lin. LIBSVM: a library for support vector machines. http://www.csie. ntu.edu.tw/cjlin/libsvm, 2001." />

<citation id="sk-2" title="Python: Batteries Included" summary="P.F. Dubois, editor. Python: Batteries Included, volume 9 of Computing in Science &amp; Engineering. IEEE/AIP, May 2007." description="P.F. Dubois, editor. Python: Batteries Included, volume 9 of Computing in Science &amp; Engineering. IEEE/AIP, May 2007." />

<citation id="sk-3" title="LIBLINEAR: a library for large linear classification" summary="R.E. Fan, K.W. Chang, C.J. Hsieh, X.R. Wang, and C.J. Lin. LIBLINEAR: a library for large linear classification. The Journal of Machine Learning Research, 9:1871–1874, 2008." description="R.E. Fan, K.W. Chang, C.J. Hsieh, X.R. Wang, and C.J. Lin. LIBLINEAR: a library for large linear classification. The Journal of Machine Learning Research, 9:1871–1874, 2008." />

<citation id="sk-4" title="Regularization paths for generalized linear models via coordinate descent" summary="J. Friedman, T. Hastie, and R. Tibshirani. Regularization paths for generalized linear models via coordinate descent. Journal of Statistical Software, 33(1):1, 2010." description="J. Friedman, T. Hastie, and R. Tibshirani. Regularization paths for generalized linear models via coordinate descent. Journal of Statistical Software, 33(1):1, 2010." />

<citation id="sk-5" title="Result analysis of the NIPS 2003 feature selection challenge" summary="I Guyon, S. R. Gunn, A. Ben-Hur, and G. Dror. Result analysis of the NIPS 2003 feature selection challenge, 2004." description="I Guyon, S. R. Gunn, A. Ben-Hur, and G. Dror. Result analysis of the NIPS 2003 feature selection challenge, 2004." />

<citation id="sk-6" title="PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data" summary="M. Hanke, Y.O. Halchenko, P.B. Sederberg, S.J. Hanson, J.V. Haxby, and S. Pollmann. PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data. Neuroinformatics, 7(1):" description="M. Hanke, Y.O. Halchenko, P.B. Sederberg, S.J. Hanson, J.V. Haxby, and S. Pollmann. PyMVPA: A Python toolbox for multivariate pattern analysis of fMRI data. Neuroinformatics, 7(1):37–53, 2009." />

<citation id="sk-7" title="Least Angle Regression, Lasso and Forward Stagewise" summary="T. Hastie and B. Efron. Least Angle Regression, Lasso and Forward Stagewise. http://cran. r-project.org/web/packages/lars/lars.pdf, 2004." description="T. Hastie and B. Efron. Least Angle Regression, Lasso and Forward Stagewise. http://cran. r-project.org/web/packages/lars/lars.pdf, 2004." />

<citation id="sk-8" title="A supervised clustering approach for fMRI-based inference of brain states" summary="V. Michel, A. Gramfort, G. Varoquaux, E. Eger, C. Keribin, and B. Thirion. A supervised clustering approach for fMRI-based inference of brain states. Patt Rec, page epub ahead of p" description="V. Michel, A. Gramfort, G. Varoquaux, E. Eger, C. Keribin, and B. Thirion. A supervised clustering approach for fMRI-based inference of brain states. Patt Rec, page epub ahead of print, April 2011. doi: 10.1016/j.patcog.2011.04.006." />

<citation id="sk-9" title="Scientific Python" summary="K.J. Millman and M. Avaizis, editors. Scientific Python, volume 11 of Computing in Science &amp; Engineering. IEEE/AIP, March 2011." description="K.J. Millman and M. Avaizis, editors. Scientific Python, volume 11 of Computing in Science &amp; Engineering. IEEE/AIP, March 2011." />

<citation id="sk-10" title="Five balltree construction algorithms" summary="S.M. Omohundro. Five balltree construction algorithms. ICSI Technical Report TR-89-063, 1989." description="S.M. Omohundro. Five balltree construction algorithms. ICSI Technical Report TR-89-063, 1989." />

<citation id="sk-11" title="A randomized algorithm for principal component analysis" summary="V. Rokhlin, A. Szlam, and M. Tygert. A randomized algorithm for principal component analysis. SIAM Journal on Matrix Analysis and Applications, 31(3):1100–1124, 2009." description="V. Rokhlin, A. Szlam, and M. Tygert. A randomized algorithm for principal component analysis. SIAM Journal on Matrix Analysis and Applications, 31(3):1100–1124, 2009." />

<citation id="sk-12" title="PyBrain" summary="T. Schaul, J. Bayer, D. Wierstra, Y. Sun, M. Felder, F. Sehnke, T. Rückstieß, and J. Schmidhuber. PyBrain. The Journal of Machine Learning Research, 11:743–746, 2010." description="T. Schaul, J. Bayer, D. Wierstra, Y. Sun, M. Felder, F. Sehnke, T. Rückstieß, and J. Schmidhuber. PyBrain. The Journal of Machine Learning Research, 11:743–746, 2010." />

<citation id="sk-13" title="The SHOGUN machine learning toolbox" summary="S. Sonnenburg, G. Rätsch, S. Henschel, C. Widmer, J. Behr, A. Zien, F. de Bona, A. Binder, C. Gehl, and V. Franc. The SHOGUN machine learning toolbox. Journal of Machine Learning R" description="S. Sonnenburg, G. Rätsch, S. Henschel, C. Widmer, J. Behr, A. Zien, F. de Bona, A. Binder, C. Gehl, and V. Franc. The SHOGUN machine learning toolbox. Journal of Machine Learning Research, 11:1799–1802, 2010." />

<citation id="sk-14" title="The NumPy array: A structure for efficient numerical computation" summary="S. Van der Walt, S.C Colbert, and G. Varoquaux. The NumPy array: A structure for efficient numerical computation. Computing in Science and Engineering, 11, 2011." description="S. Van der Walt, S.C Colbert, and G. Varoquaux. The NumPy array: A structure for efficient numerical computation. Computing in Science and Engineering, 11, 2011." />

<citation id="sk-15" title="Modular toolkit for data processing (MDP): A Python data processing framework" summary="T. Zito, N. Wilbert, L. Wiskott, and P. Berkes. Modular toolkit for data processing (MDP): A Python data processing framework. Frontiers in Neuroinformatics, 2, 2008." description="T. Zito, N. Wilbert, L. Wiskott, and P. Berkes. Modular toolkit for data processing (MDP): A Python data processing framework. Frontiers in Neuroinformatics, 2, 2008." />
