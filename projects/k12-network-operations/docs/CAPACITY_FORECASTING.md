# Capacity Forecasting

The project models eight months of synthetic 95th-percentile WAN utilization for each district.

```bash
python -m k12ops.cli capacity --history data/capacity_history.json --top 10
```

The forecast intentionally uses a simple transparent linear trend rather than a black-box model. The portfolio goal is to show that operational decisions can be made from sustained utilization trends instead of reacting to isolated spikes.
