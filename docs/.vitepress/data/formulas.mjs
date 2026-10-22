// 《机械原理》核心公式卡数据。
// 供 FormulaQuickSearch.vue 使用；每张卡对应教材章节与站内链接。
// cat 顺序即筛选按钮顺序。

export const categories = ['结构', '运动', '力', '平衡', '运转', '连杆', '凸轮', '齿轮', '轮系', '机器人']

export const formulas = [
  // ---------------------------------------------------------------- 结构
  {
    name: '平面机构自由度',
    cat: '结构',
    latex: String.raw`F=3n-2p_L-p_H`,
    note: 'n 为活动构件数（不含机架），p_L 为低副数，p_H 为高副数。计算前先处理复合铰链、局部自由度与虚约束。',
    chapter: '02',
    link: '/chapters/02-structural-analysis',
    hot: true,
    keys: '自由度 机构 低副 高副'
  },
  {
    name: '机构具有确定运动的条件',
    cat: '结构',
    latex: String.raw`F=W>0`,
    note: 'W 为原动件数。自由度大于零且等于原动件数时，机构各构件运动确定；F>W 运动不确定，F<W 构件被拉断或卡死。',
    chapter: '02',
    link: '/chapters/02-structural-analysis',
    keys: '确定运动 原动件'
  },
  {
    name: '复合铰链的转动副数',
    cat: '结构',
    latex: String.raw`p_L=m-1`,
    note: 'm 个构件在同一轴线处组成复合铰链，实际形成 m−1 个转动副；数错是自由度计算最常见的失分点。',
    chapter: '02',
    link: '/chapters/02-structural-analysis',
    keys: '复合铰链 转动副'
  },
  {
    name: '基本杆组的自由度条件',
    cat: '结构',
    latex: String.raw`F=3n-2p_L=0`,
    note: '基本杆组是不能再拆的、自由度为零的构件组；常用 II 级组为 2 个构件、3 个低副。机构 = 原动件 + 若干基本杆组。',
    chapter: '02',
    link: '/chapters/02-structural-analysis',
    keys: '基本杆组 组成原理 结构分类'
  },

  // ---------------------------------------------------------------- 运动
  {
    name: '速度瞬心总数',
    cat: '运动',
    latex: String.raw`N=\frac{n(n-1)}{2}`,
    note: 'n 为构件数（含机架）。每两个构件有一个瞬心；绝对瞬心在机架上，其余为相对瞬心。',
    chapter: '03',
    link: '/chapters/03-kinematic-analysis',
    hot: true,
    keys: '瞬心 三心定理'
  },
  {
    name: '速度合成（相对运动）',
    cat: '运动',
    latex: String.raw`\boldsymbol{v}_C=\boldsymbol{v}_B+\boldsymbol{v}_{CB}`,
    note: '同一构件上两点速度关系：v_CB 的方向垂直于 BC，大小等于 ω·BC。图解法据此作速度多边形。',
    chapter: '03',
    link: '/chapters/03-kinematic-analysis',
    keys: '速度 多边形 影像'
  },
  {
    name: '加速度合成（相对运动）',
    cat: '运动',
    latex: String.raw`\boldsymbol{a}_C=\boldsymbol{a}_B+\boldsymbol{a}_{CB}^{n}+\boldsymbol{a}_{CB}^{t}`,
    note: '法向分量 a_CB^n=ω²·BC，指向 B；切向分量 a_CB^t=ε·BC，垂直于 BC。',
    chapter: '03',
    link: '/chapters/03-kinematic-analysis',
    hot: true,
    keys: '加速度 法向 切向'
  },
  {
    name: '哥氏加速度',
    cat: '运动',
    latex: String.raw`\boldsymbol{a}_k=2\boldsymbol{\omega}_1\times\boldsymbol{v}_{B2B1}`,
    note: '牵连运动为转动时出现，大小为 2ω₁v_B2B1；方向由右手定则或把 v_B2B1 沿 ω₁ 方向转 90° 确定。',
    chapter: '03',
    link: '/chapters/03-kinematic-analysis',
    keys: '哥氏 牵连运动 转动'
  },
  {
    name: '三心定理速度关系',
    cat: '运动',
    latex: String.raw`\omega_1\overline{P_{14}P_{13}}=\omega_3\overline{P_{34}P_{13}}`,
    note: '瞬心 P₁₃ 作为构件 1、3 上的同一点速度相等，由此可由已知 ω₁ 求 ω₃。',
    chapter: '03',
    link: '/chapters/03-kinematic-analysis',
    keys: '瞬心 角速度 三心定理'
  },

  // ---------------------------------------------------------------- 力
  {
    name: '摩擦角',
    cat: '力',
    latex: String.raw`\varphi_f=\arctan f`,
    note: 'f 为摩擦系数。总反力与法线方向的夹角等于摩擦角；移动副自锁常以“驱动力作用线落在摩擦角内”判定。',
    chapter: '04',
    link: '/chapters/04-static-force-analysis',
    keys: '摩擦角 摩擦系数 自锁'
  },
  {
    name: '转动副摩擦圆半径',
    cat: '力',
    latex: String.raw`\rho=f_v r`,
    note: 'f_v 为当量摩擦系数（考虑轴颈配合间隙），r 为轴颈半径。总反力必与摩擦圆相切，方向阻碍相对转动。',
    chapter: '04',
    link: '/chapters/04-static-force-analysis',
    keys: '摩擦圆 轴颈 总反力'
  },
  {
    name: '机械效率',
    cat: '力',
    latex: String.raw`\eta=\frac{W_r}{W_d}=\frac{P_r}{P_d}`,
    note: 'W_r、P_r 为输出功、功率；W_d、P_d 为输入功、功率。η 恒小于 1，损失主要来自摩擦。',
    chapter: '04',
    link: '/chapters/04-static-force-analysis',
    hot: true,
    keys: '效率 输入功 输出功'
  },
  {
    name: '串联机组总效率',
    cat: '力',
    latex: String.raw`\eta=\eta_1\eta_2\cdots\eta_k`,
    note: '串联时前一级的输出即后一级的输入，总效率等于各级效率之积；多级传动中效率最低的一级影响最大。',
    chapter: '04',
    link: '/chapters/04-static-force-analysis',
    keys: '串联 效率 多级传动'
  },
  {
    name: '自锁条件',
    cat: '力',
    latex: String.raw`\eta\le 0`,
    note: '机械效率小于等于零时，无论驱动力多大都不能使机构运动，即发生自锁。也可用“驱动力作用在摩擦角/摩擦圆内”判定。',
    chapter: '04',
    link: '/chapters/04-static-force-analysis',
    hot: true,
    keys: '自锁 效率 摩擦角'
  },
  {
    name: '斜面效率（等速上升）',
    cat: '力',
    latex: String.raw`\eta=\frac{\tan\alpha}{\tan(\alpha+\varphi_f)}`,
    note: 'α 为斜面倾角，φ_f 为摩擦角。α 越小、φ_f 越大，效率越低；当 α≤φ_f 时自锁。',
    chapter: '04',
    link: '/chapters/04-static-force-analysis',
    keys: '斜面 效率 螺旋'
  },

  // ---------------------------------------------------------------- 平衡
  {
    name: '刚性转子静平衡条件',
    cat: '平衡',
    latex: String.raw`\sum m_i r_i=0`,
    note: '各偏心质量的离心惯性力矢量和为零。适用于轴向尺寸较小的盘状转子（b/D<0.2 量级），可用单面配重平衡。',
    chapter: '06',
    link: '/chapters/06-balancing',
    hot: true,
    keys: '静平衡 配重 惯性力'
  },
  {
    name: '刚性转子动平衡条件',
    cat: '平衡',
    latex: String.raw`\sum m_i\boldsymbol{r}_i=0,\qquad \sum m_i l_i\boldsymbol{r}_i=0`,
    note: '惯性力与惯性力矩同时平衡。长转子（b/D 较大）需在两个平衡平面内加配重，静平衡只是动平衡的必要条件。',
    chapter: '06',
    link: '/chapters/06-balancing',
    hot: true,
    keys: '动平衡 惯性力矩 双面平衡'
  },
  {
    name: '静平衡配重质量',
    cat: '平衡',
    latex: String.raw`m_b r_b=m r`,
    note: '在半径 r_b 处加配重 m_b，抵消半径 r 处的偏心质量 m；配重方向与偏心方向相反。',
    chapter: '06',
    link: '/chapters/06-balancing',
    keys: '配重 偏心质量'
  },
  {
    name: '机构惯性力系完全平衡条件',
    cat: '平衡',
    latex: String.raw`\sum\boldsymbol{F}_I=0,\qquad \sum\boldsymbol{M}_I=0`,
    note: '机构总惯性力与总惯性力矩同时为零，则机架不受动压力。完全平衡常需多组配重，部分平衡只消除主要方向的惯性力。',
    chapter: '06',
    link: '/chapters/06-balancing',
    keys: '机构平衡 惯性力 动压力'
  },

  // ---------------------------------------------------------------- 运转
  {
    name: '等效转动惯量',
    cat: '运转',
    latex: String.raw`J_e=\sum_i\left[m_i\left(\frac{v_{Si}}{\omega}\right)^2+J_{Si}\left(\frac{\omega_i}{\omega}\right)^2\right]`,
    note: '把整个机械的动能折算到原动件上。v_Si、ω_i 为构件 i 质心速度与角速度，ω 为原动件角速度。',
    chapter: '07',
    link: '/chapters/07-operation-speed-fluctuation',
    hot: true,
    keys: '等效 转动惯量 动能'
  },
  {
    name: '等效力矩',
    cat: '运转',
    latex: String.raw`M_e=\sum_i\left(F_i\frac{v_i}{\omega}\cos\alpha_i\pm M_i\frac{\omega_i}{\omega}\right)`,
    note: '把各构件上的力与力矩折算到原动件上；α_i 为力与速度方向的夹角。驱动力取正、阻力取负，方向由功率符号决定。',
    chapter: '07',
    link: '/chapters/07-operation-speed-fluctuation',
    keys: '等效力矩 功率 折算'
  },
  {
    name: '机械运动方程式（动能形式）',
    cat: '运转',
    latex: String.raw`\int_{\varphi_0}^{\varphi}M_e\,d\varphi=\frac12 J_e\omega^2-\frac12 J_{e0}\omega_0^2`,
    note: '等效力矩所作的功等于机械动能的增量；这是分析启动、稳定运转与停车过程的基本方程。',
    chapter: '07',
    link: '/chapters/07-operation-speed-fluctuation',
    keys: '运动方程 动能 功'
  },
  {
    name: '速度不均匀系数',
    cat: '运转',
    latex: String.raw`\delta=\frac{\omega_{\max}-\omega_{\min}}{\omega_m}`,
    note: 'ω_m 为平均角速度，常取 (ω_max+ω_min)/2。δ 越小，运转越平稳；不同工作机械对 δ 有许用值要求。',
    chapter: '07',
    link: '/chapters/07-operation-speed-fluctuation',
    hot: true,
    keys: '速度波动 不均匀系数 平稳'
  },
  {
    name: '飞轮转动惯量',
    cat: '运转',
    latex: String.raw`J_F=\frac{\Delta W_{\max}}{\omega_m^2\delta}`,
    note: 'ΔW_max 为最大盈亏功。飞轮只能调节周期性速度波动，不能调节非周期性波动。',
    chapter: '07',
    link: '/chapters/07-operation-speed-fluctuation',
    hot: true,
    keys: '飞轮 盈亏功 周期性波动'
  },

  // ---------------------------------------------------------------- 连杆
  {
    name: '格拉肖夫条件',
    cat: '连杆',
    latex: String.raw`l_{\min}+l_{\max}\le l'+l''`,
    note: '最短杆与最长杆长度之和不超过其余两杆之和时，机构存在整转副；再结合最短杆是否为连架杆/机架，判定曲柄摇杆、双曲柄或双摇杆。',
    chapter: '08',
    link: '/chapters/08-linkages',
    hot: true,
    keys: '格拉肖夫 整转副 曲柄存在条件'
  },
  {
    name: '行程速比系数',
    cat: '连杆',
    latex: String.raw`K=\frac{180^\circ+\theta}{180^\circ-\theta}`,
    note: 'θ 为极位夹角。K>1 表示有急回特性；K=1 时 θ=0，无急回。',
    chapter: '08',
    link: '/chapters/08-linkages',
    hot: true,
    keys: '急回 行程速比 极位夹角'
  },
  {
    name: '极位夹角',
    cat: '连杆',
    latex: String.raw`\theta=180^\circ\frac{K-1}{K+1}`,
    note: '由要求的行程速比系数反求极位夹角，是按 K 设计四杆机构的第一步。',
    chapter: '08',
    link: '/chapters/08-linkages',
    keys: '极位夹角 急回 设计'
  },
  {
    name: '压力角与传动角',
    cat: '连杆',
    latex: String.raw`\gamma=90^\circ-\alpha`,
    note: 'α 为从动件受力方向与速度方向的夹角，γ 为连杆与从动件之间的锐角。γ 越大传力越好，通常要求 γ_min≥40°（高速重载更大）。',
    chapter: '08',
    link: '/chapters/08-linkages',
    keys: '压力角 传动角 传力性能'
  },
  {
    name: '曲柄滑块位移（近似）',
    cat: '连杆',
    latex: String.raw`s\approx r(1-\cos\varphi)+\frac{r^2}{2l}\sin^2\varphi`,
    note: 'r 为曲柄半径，l 为连杆长度，φ 为曲柄转角。精确式为 l(1−√(1−λ²sin²φ))，λ=r/l；近似式在 λ 较小时足够。',
    chapter: '08',
    link: '/chapters/08-linkages',
    keys: '曲柄滑块 位移 行程'
  },

  // ---------------------------------------------------------------- 凸轮
  {
    name: '等速运动规律',
    cat: '凸轮',
    latex: String.raw`s=\frac{h}{\Phi}\varphi,\qquad v=\frac{h}{\Phi}\omega`,
    note: '推程 0≤φ≤Φ。速度突变，始末两处加速度理论上无穷大，产生刚性冲击；只宜用于低速轻载。',
    chapter: '09',
    link: '/chapters/09-cams',
    hot: true,
    keys: '等速 运动规律 刚性冲击'
  },
  {
    name: '等加速等减速运动规律',
    cat: '凸轮',
    latex: String.raw`s=2h\left(\frac{\varphi}{\Phi}\right)^2\quad\left(0\le\varphi\le\frac{\Phi}{2}\right)`,
    note: '前半程等加速、后半程等减速；加速度在始末和中间位置突变，产生柔性冲击。',
    chapter: '09',
    link: '/chapters/09-cams',
    keys: '等加速 等减速 柔性冲击'
  },
  {
    name: '余弦加速度运动规律',
    cat: '凸轮',
    latex: String.raw`s=\frac{h}{2}\left[1-\cos\left(\pi\frac{\varphi}{\Phi}\right)\right]`,
    note: '又称简谐运动规律。位移曲线光滑，但加速度在推程始末不为零，有柔性冲击；适用于中速。',
    chapter: '09',
    link: '/chapters/09-cams',
    keys: '余弦加速度 简谐 柔性冲击'
  },
  {
    name: '正弦加速度运动规律',
    cat: '凸轮',
    latex: String.raw`s=h\left[\frac{\varphi}{\Phi}-\frac{1}{2\pi}\sin\left(2\pi\frac{\varphi}{\Phi}\right)\right]`,
    note: '又称摆线运动规律。速度、加速度均连续，无刚性、柔性冲击，但最大加速度较大；适用于高速轻载。',
    chapter: '09',
    link: '/chapters/09-cams',
    keys: '正弦加速度 摆线 无冲击'
  },
  {
    name: '凸轮机构压力角',
    cat: '凸轮',
    latex: String.raw`\tan\alpha=\frac{\mathrm{d}s/\mathrm{d}\varphi}{r_0+s}`,
    note: '对心直动从动件、盘形凸轮（e=0）。分子 ds/dφ 单位为 mm，分母 r₀+s 单位为 mm，故 tanα 无量纲；偏置时分子改为 |ds/dφ−e|、分母改为 √(r₀²−e²)+s。加大基圆半径 r₀ 可减小 α。',
    chapter: '09',
    link: '/chapters/09-cams',
    hot: true,
    keys: '压力角 基圆半径 从动件'
  },
  {
    name: '滚子半径条件',
    cat: '凸轮',
    latex: String.raw`r_r<\rho_{\min}`,
    note: 'ρ_min 为理论廓线最小曲率半径。滚子半径过大将使实际廓线变尖或失真；外凸处通常取 r_r≤0.8ρ_min，内凹处不受此限。',
    chapter: '09',
    link: '/chapters/09-cams',
    keys: '滚子半径 失真 曲率半径'
  },

  // ---------------------------------------------------------------- 齿轮
  {
    name: '齿轮传动比',
    cat: '齿轮',
    latex: String.raw`i_{12}=\frac{\omega_1}{\omega_2}=\frac{d_2}{d_1}=\frac{z_2}{z_1}`,
    note: '定传动比是渐开线齿轮的核心优点；传动比与分度圆直径、齿数成反比。',
    chapter: '10',
    link: '/chapters/10-gears',
    hot: true,
    keys: '传动比 齿数 分度圆'
  },
  {
    name: '分度圆直径',
    cat: '齿轮',
    latex: String.raw`d=mz`,
    note: 'm 为模数（mm），z 为齿数。模数标准化，是齿轮几何尺寸计算的基础参数。',
    chapter: '10',
    link: '/chapters/10-gears',
    keys: '模数 分度圆 齿数'
  },
  {
    name: '标准中心距',
    cat: '齿轮',
    latex: String.raw`a=\frac{m(z_1+z_2)}{2}`,
    note: '标准直齿圆柱齿轮外啮合。a 等于两分度圆半径之和，此时分度圆与节圆重合。',
    chapter: '10',
    link: '/chapters/10-gears',
    hot: true,
    keys: '中心距 外啮合 标准齿轮'
  },
  {
    name: '齿顶圆与齿根圆直径',
    cat: '齿轮',
    latex: String.raw`d_a=m(z+2h_a^*),\qquad d_f=m(z-2h_a^*-2c^*)`,
    note: 'h_a^* 为齿顶高系数（正常齿 1，短齿 0.8），c^* 为顶隙系数（正常齿 0.25）。',
    chapter: '10',
    link: '/chapters/10-gears',
    keys: '齿顶圆 齿根圆 齿顶高'
  },
  {
    name: '渐开线压力角与基圆',
    cat: '齿轮',
    latex: String.raw`r_b=r\cos\alpha`,
    note: 'r 为分度圆半径，r_b 为基圆半径。渐开线上各点压力角不同，分度圆压力角 α 通常为 20°。',
    chapter: '10',
    link: '/chapters/10-gears',
    hot: true,
    keys: '渐开线 基圆 压力角'
  },
  {
    name: '重合度',
    cat: '齿轮',
    latex: String.raw`\varepsilon_\alpha=\frac{1}{2\pi}\left[z_1(\tan\alpha_{a1}-\tan\alpha')+z_2(\tan\alpha_{a2}-\tan\alpha')\right]`,
    note: 'α_a 为齿顶圆压力角，α′ 为啮合角。ε_α>1 才能连续传动；一般齿轮传动要求 ε_α≥1.1～1.4。',
    chapter: '10',
    link: '/chapters/10-gears',
    hot: true,
    keys: '重合度 连续传动 啮合'
  },
  {
    name: '不根切最少齿数',
    cat: '齿轮',
    latex: String.raw`z_{\min}=\frac{2h_a^*}{\sin^2\alpha}`,
    note: '标准直齿圆柱齿轮，α=20°、h_a^*=1 时 z_min=17。少于 z_min 需采用变位齿轮或增大压力角。',
    chapter: '10',
    link: '/chapters/10-gears',
    keys: '根切 最少齿数 变位'
  },
  {
    name: '斜齿轮当量齿数',
    cat: '齿轮',
    latex: String.raw`z_v=\frac{z}{\cos^3\beta}`,
    note: 'β 为螺旋角。当量齿数用于选铣刀号、计算强度；斜齿轮不发生根切的最少齿数比直齿轮少。',
    chapter: '10',
    link: '/chapters/10-gears',
    keys: '斜齿轮 当量齿数 螺旋角'
  },
  {
    name: '法面模数与端面模数',
    cat: '齿轮',
    latex: String.raw`m_t=\frac{m_n}{\cos\beta}`,
    note: '法面模数 m_n 标准，端面模数 m_t=m_n/cosβ。斜齿轮几何尺寸用端面参数计算，强度计算常用法面参数。',
    chapter: '10',
    link: '/chapters/10-gears',
    keys: '斜齿轮 法面 端面'
  },
  {
    name: '斜齿轮中心距',
    cat: '齿轮',
    latex: String.raw`a=\frac{m_n(z_1+z_2)}{2\cos\beta}`,
    note: '可通过调整螺旋角 β 凑配中心距，这是斜齿轮传动的一个重要便利。',
    chapter: '10',
    link: '/chapters/10-gears',
    keys: '斜齿轮 中心距 螺旋角'
  },
  {
    name: '蜗杆传动比',
    cat: '齿轮',
    latex: String.raw`i=\frac{n_1}{n_2}=\frac{z_2}{z_1}`,
    note: 'z_1 为蜗杆头数，z_2 为蜗轮齿数。单头蜗杆可获得很大传动比，但效率低、易自锁。',
    chapter: '10',
    link: '/chapters/10-gears',
    hot: true,
    keys: '蜗杆 蜗轮 传动比 自锁'
  },
  {
    name: '直齿锥齿轮分度圆锥角',
    cat: '齿轮',
    latex: String.raw`\tan\delta_1=\frac{z_1}{z_2}`,
    note: '两轴垂直（轴交角 90°）的标准直齿锥齿轮。δ 为分度圆锥角，锥距 R 对两轮相同。',
    chapter: '10',
    link: '/chapters/10-gears',
    keys: '锥齿轮 分度圆锥角 轴交角'
  },

  // ---------------------------------------------------------------- 轮系
  {
    name: '定轴轮系传动比',
    cat: '轮系',
    latex: String.raw`i_{1n}=(-1)^m\frac{\prod z_{\text{从}}}{\prod z_{\text{主}}}`,
    note: 'm 为外啮合对数，符号由 (−1)^m 判定；空间齿轮（锥齿、蜗杆）只按箭头判方向。惰轮不改变传动比大小。',
    chapter: '11',
    link: '/chapters/11-gear-trains',
    hot: true,
    keys: '定轴轮系 传动比 惰轮'
  },
  {
    name: '周转轮系转化机构传动比',
    cat: '轮系',
    latex: String.raw`i_{1n}^H=\frac{n_1-n_H}{n_n-n_H}=\pm\frac{\prod z_{\text{从}}}{\prod z_{\text{主}}}`,
    note: '给整个轮系加 −n_H 使其“转化”为定轴轮系。n₁、n_n、n_H 均带正负号（同向为正）。',
    chapter: '11',
    link: '/chapters/11-gear-trains',
    hot: true,
    keys: '周转轮系 转化机构 系杆'
  },
  {
    name: '行星轮系传动比',
    cat: '轮系',
    latex: String.raw`i_{1H}=1-i_{1n}^H`,
    note: '当中心轮 n 固定（n_n=0）时成立。先算转化机构传动比，再反求行星架与中心轮的传动比。',
    chapter: '11',
    link: '/chapters/11-gear-trains',
    hot: true,
    keys: '行星轮系 行星架 传动比'
  },
  {
    name: '复合轮系传动比分解',
    cat: '轮系',
    latex: String.raw`i_{\text{总}}=\prod i_{\text{各基本轮系}}`,
    note: '先正确划分定轴轮系与周转轮系，再分别列传动比方程，联立求解。划分错误是复合轮系题的主要失分原因。',
    chapter: '11',
    link: '/chapters/11-gear-trains',
    keys: '复合轮系 划分 联立'
  },

  // ---------------------------------------------------------------- 机器人
  {
    name: '齐次变换矩阵',
    cat: '机器人',
    latex: String.raw`{}^{i-1}\boldsymbol{T}_i=\begin{bmatrix}{}^{i-1}\boldsymbol{R}_i & {}^{i-1}\boldsymbol{p}_i\\ \boldsymbol{0} & 1\end{bmatrix}`,
    note: '同时描述相邻连杆坐标系的姿态（旋转矩阵 R）与位置（平移向量 p），是机器人位姿描述的基本工具。',
    chapter: '14',
    link: '/chapters/14-robots',
    hot: true,
    keys: '齐次变换 位姿 旋转矩阵'
  },
  {
    name: '绕 z 轴旋转矩阵',
    cat: '机器人',
    latex: String.raw`\boldsymbol{R}_z(\theta)=\begin{bmatrix}\cos\theta & -\sin\theta & 0\\ \sin\theta & \cos\theta & 0\\ 0 & 0 & 1\end{bmatrix}`,
    note: '绕 x、y 轴同理。多个旋转矩阵连乘时，注意左乘/右乘对应的坐标系变换顺序。',
    chapter: '14',
    link: '/chapters/14-robots',
    keys: '旋转矩阵 坐标变换'
  },
  {
    name: '机器人正运动学',
    cat: '机器人',
    latex: String.raw`{}^{0}\boldsymbol{T}_n={}^{0}\boldsymbol{T}_1{}^{1}\boldsymbol{T}_2\cdots{}^{n-1}\boldsymbol{T}_n`,
    note: '已知各关节变量，由 D-H 参数矩阵连乘求末端执行器位姿。逆运动学则是由位姿反求关节变量，通常多解。',
    chapter: '14',
    link: '/chapters/14-robots',
    hot: true,
    keys: '正运动学 D-H 矩阵'
  },
  {
    name: '速度雅可比',
    cat: '机器人',
    latex: String.raw`\dot{\boldsymbol{x}}=\boldsymbol{J}(\boldsymbol{q})\dot{\boldsymbol{q}}`,
    note: 'J 为雅可比矩阵，建立关节速度与末端速度的线性映射。J 奇异时机器人失去某些方向自由度，即奇异位形。',
    chapter: '14',
    link: '/chapters/14-robots',
    keys: '雅可比 速度 奇异位形'
  },
  {
    name: '静力映射',
    cat: '机器人',
    latex: String.raw`\boldsymbol{\tau}=\boldsymbol{J}^{T}(\boldsymbol{q})\boldsymbol{F}`,
    note: '末端受到的力 F 通过雅可比转置映射为关节力矩 τ；与速度雅可比互为对偶，是静力分析的核心关系。',
    chapter: '14',
    link: '/chapters/14-robots',
    keys: '静力 雅可比 关节力矩'
  }
]
