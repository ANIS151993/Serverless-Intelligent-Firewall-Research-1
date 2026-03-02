# Towards a Serverless Intelligent Firewall: AI-Driven Security, and Zero-Trust Architectures

**Research Paper #1 — Serverless Intelligent Firewall Series**
**Published in IEEE, 2025**

> **Authors:** Md Anisur Rahman Chowdhury\*, Hoang Nam Dang, Dr. Ronny Bazan-Antequera *(Gannon University, USA)* · Md. Sayham Khan, Md Razaul Karim *(University of the Potomac, USA)* · Dr. Sheheeda Manakkadu *(Gannon University, USA)*

---

## Research Portal

**Website:** [https://anis151993.github.io/Serverless-Intelligent-Firewall-Research-1/](https://anis151993.github.io/Serverless-Intelligent-Firewall-Research-1/)

**YouTube:** [https://youtu.be/K04bOFbv204](https://youtu.be/K04bOFbv204)

---

## Abstract

The stateful and transient nature of serverless computing environments presents significant challenges to traditional network security, particularly in implementing Zero-Trust Architecture (ZTA) principles. Rule-based intrusion detection systems and traditional firewalls tend to be inflexible and context-insensitive, with little ability to protect transient, stateless functions.

This work proposes a **Serverless Intelligent Firewall framework** that combines deep learning-based intrusion detection with Zero-Trust enforcement for delivering adaptive, real-time threat detection in cloud-native systems. Drawing on the CICIDS2017 dataset, the novel approach employs a **Long Short-Term Memory (LSTM)** model to capture temporal patterns in traffic behavior, thereby discovering thinly disguised anomalies and synchronized attacks that stateless models often miss.

The LSTM architecture achieved **98% accuracy, precision, recall, and F1-score**, outperforming baseline models including Decision Trees (DT), Support Vector Machines (SVM), and Convolutional Neural Networks (CNN).

**Keywords:** Serverless computing, intelligent firewall, ZTA, intrusion detection system, LSTM, deep learning, cybersecurity, CICIDS2017, real-time threat detection.

---

## Key Results

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| SVM | 88.40% | 84.10% | 77.80% | 80.80% |
| Decision Tree | 90.20% | 87.60% | 81.30% | 84.30% |
| CNN | 93.00% | 95.10% | 85.40% | 89.90% |
| **LSTM (Proposed)** | **98.00%** | **98.00%** | **98.00%** | **98.00%** |

### Comparative Analysis vs. State-of-the-Art

| Reference | Dataset | Model | Accuracy |
|-----------|---------|-------|----------|
| **Proposed Work** | CIC-IDS2017 | **LSTM** | **98.00%** |
| Altunay et al. (2023) | UNSW-NB15 | Hybrid CNN+LSTM | 93.21% |
| Bamber et al. (2025) | CIC-IDS2017 | Hybrid CNN-LSTM | 95.00% |
| Neto et al. / FedSA (2022) | CIC-IDS2017 | Federated IDS | 97.00% |

---

## Repository Structure

```
.
├── docs/                                   # GitHub Pages website
│   ├── index.html                          # Main research portal
│   ├── styles.css                          # Stylesheet
│   ├── script.js                           # JavaScript (charts, interactivity)
│   └── assets/
│       ├── images/                         # All result figures
│       │   ├── architecture-diagram.png    # Methodology flowchart
│       │   ├── lstm-model.png              # LSTM architecture diagram
│       │   ├── accuracy.png                # Training/validation accuracy
│       │   ├── loss.png                    # Training/validation loss
│       │   ├── confusion-matrix.png        # LSTM confusion matrix
│       │   └── classwise-performance.png   # Per-class precision/recall
│       └── papers/
│           └── Serverless-Firewall-Report-Research-1.pdf
│
├── intelligent-firewall-AI-Model/          # AI model implementation
│   ├── train.ipynb                         # Model training notebook
│   ├── test.ipynb                          # Model evaluation notebook
│   ├── torch_ml_models.ipynb               # Baseline ML models (DT, SVM, CNN)
│   ├── feature_selections.ipynb            # Feature selection & EDA
│   ├── statistics.ipynb                    # Statistical analysis
│   ├── lambda_function.py                  # AWS Lambda inference handler
│   ├── bilstm_model.pth                    # Trained model weights
│   ├── requirements.txt                    # Python dependencies
│   ├── Dockerfile                          # Container for serverless deployment
│   ├── results/
│   │   └── results_Final.csv               # Performance metrics (CSV)
│   └── lambda-pytorch-ids/
│       └── lambda_function.py              # Lambda deployment package
│
├── main.tex                                # IEEE LaTeX source
├── Bibliography.bib                        # References (BibTeX)
├── IEEEtran.cls                            # IEEE LaTeX class file
└── README.md
```

---

## Methodology

### Dataset: CICIDS2017

- **Source:** Canadian Institute for Cybersecurity (Kaggle-hosted)
- **Scale:** 2.8 million+ labeled network flow records
- **Features:** 78 numerical features + 1 categorical label
- **Classes consolidated:** BENIGN, DoS, DDoS, PortScan, Other

### Preprocessing Pipeline

1. **Label Cleaning** — Whitespace removal, attack type consolidation
2. **Class Balancing** — Undersampling to match minority class size
3. **Feature Cleaning** — Replace NaN/±∞ with zero, select numerical features
4. **Z-Score Normalization** — Zero mean, unit variance per feature

### LSTM Architecture

```
Input (78 features)
  → LSTM Layer 1 (128 hidden units, dropout 0.3)
  → LSTM Layer 2 (64 hidden units, dropout 0.3)
  → LSTM Layer 3 (32 hidden units, dropout 0.3)
  → Dense Layer (64 units, ReLU)
  → Output Layer (Softmax, 5 classes)
```

**Optimizer:** Adam (lr=0.001) | **Epochs:** 120 | **Batch:** 64 | **Early stopping:** patience=10

### Serverless Deployment

The trained LSTM model is packaged as an **AWS Lambda function** for real-time, stateless inference — aligning with Zero-Trust principles:
- **No persistent infrastructure** — functions scale on-demand
- **Every request authenticated** — continuous verification
- **Granular access control** — least-privilege enforcement

---

## Quick Start

### Prerequisites

```bash
pip install -r intelligent-firewall-AI-Model/requirements.txt
```

### Run Training Notebook

```bash
jupyter notebook intelligent-firewall-AI-Model/train.ipynb
```

### Run Evaluation Notebook

```bash
jupyter notebook intelligent-firewall-AI-Model/test.ipynb
```

### AWS Lambda Deployment

```bash
# Build Docker container
docker build -t sif-lstm intelligent-firewall-AI-Model/

# Deploy to AWS Lambda (requires AWS CLI)
aws lambda create-function \
  --function-name intelligent-firewall \
  --package-type Image \
  --code ImageUri=<your-ecr-uri>
```

---

## Citation

If you use this work, please cite:

```bibtex
@article{chowdhury2025serverless,
  title   = {Towards a Serverless Intelligent Firewall: AI-Driven Security, and Zero-Trust Architectures},
  author  = {Chowdhury, Md Anisur Rahman and Dang, Hoang Nam and Bazan-Antequera, Ronny and Khan, Md. Sayham and Karim, Md Razaul and Manakkadu, Sheheeda},
  journal = {IEEE},
  year    = {2025}
}
```

---

## Related Research

- **Research #0:** [Distributed AI Ensemble System](https://github.com/ANIS151993/Distributed-AI) — Local distributed multi-agent LLM network
- **Website #0:** [https://anis151993.github.io/Distributed-AI/](https://anis151993.github.io/Distributed-AI/)

---

## Contact

- **Lead Author:** Md Anisur Rahman Chowdhury — engr.aanis@gmail.com
- **Institution:** Gannon University, Department of Computer and Information Science
- **YouTube:** [https://youtu.be/K04bOFbv204](https://youtu.be/K04bOFbv204)

---

*© 2025 Md Anisur Rahman Chowdhury et al. Published in IEEE.*
