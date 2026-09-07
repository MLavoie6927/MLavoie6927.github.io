from __future__ import annotations

def linear_forecast(values: list[float], periods: int=3) -> list[float]:
    if not values: return []
    n=len(values)
    if n==1: return [values[0]]*periods
    xs=list(range(n)); xm=sum(xs)/n; ym=sum(values)/n
    denom=sum((x-xm)**2 for x in xs)
    slope=sum((x-xm)*(y-ym) for x,y in zip(xs,values))/denom if denom else 0
    intercept=ym-slope*xm
    return [round(max(0,min(100,intercept+slope*(n+i))),1) for i in range(periods)]

def forecast_district(record: dict, threshold: float=80.0) -> dict:
    vals=[float(x['p95_pct']) for x in record.get('history',[])]
    forecast=linear_forecast(vals,3)
    risk='HIGH' if forecast and max(forecast)>=90 else 'WATCH' if forecast and max(forecast)>=threshold else 'NORMAL'
    return {'district':record['district'],'capacity_mbps':record['capacity_mbps'],'current_p95_pct':vals[-1] if vals else None,'forecast_p95_pct':forecast,'risk':risk}

def regional_forecast(data: dict) -> list[dict]:
    return sorted([forecast_district(x) for x in data.get('districts',[])], key=lambda x:({'HIGH':2,'WATCH':1,'NORMAL':0}[x['risk']],x['forecast_p95_pct'][-1] if x['forecast_p95_pct'] else 0), reverse=True)
