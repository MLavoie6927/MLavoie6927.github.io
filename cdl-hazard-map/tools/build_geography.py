"""Generate a small offline SVG geometry dataset from Basemap's UScounties shapefile.
The underlying county source is not a routing product. State borders are visual context only.
"""
import json
from pathlib import Path
import geopandas as gpd
from shapely.ops import transform
from shapely.geometry import Polygon,MultiPolygon,GeometryCollection
from pyproj import Transformer

root=Path(__file__).resolve().parents[1]
p='/opt/pyvenv/lib/python3.13/site-packages/mpl_toolkits/basemap_data/UScounties.shp'
gdf=gpd.read_file(p).dissolve(by='STATE')
# Coordinates in Albers meters. US mainland bounds, with room for Alaska and Hawaii insets.
proj=Transformer.from_crs('EPSG:4269','EPSG:5070',always_xy=True)
west,east,bottom,top=-2356114,2258201,272000,3172569
s=1050/(east-west)

def mainland(lon,lat):
    a,b=proj.transform(lon,lat)
    return [round(93+(a-west)*s,2), round(24+(top-b)*s,2)]

# AK: Alaska Albers using x/y bounding fit, HI: lon/lat local equirectangular inset
akproj=Transformer.from_crs('EPSG:4269','EPSG:3338',always_xy=True)
# Map AK robustly by projecting all points, projected bounds from geometry
ak=gdf.loc['AK','geometry']
akgeom=transform(lambda x,y,z=None: akproj.transform(x,y),ak)
akbounds=akgeom.bounds
akscale=min(247/(akbounds[2]-akbounds[0]),128/(akbounds[3]-akbounds[1]))
def alaska(lon,lat):
    a,b=akproj.transform(lon,lat)
    return [round(90+(a-akbounds[0])*akscale,2),round(622+(akbounds[3]-b)*akscale,2)]

hi=gdf.loc['HI','geometry']; hib=hi.bounds; his=min(145/(hib[2]-hib[0]),64/(hib[3]-hib[1]))
def hawaii(lon,lat):
    return [round(372+(lon-hib[0])*his,2),round(695+(hib[3]-lat)*his,2)]

names={'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado','CT':'Connecticut','DE':'Delaware','DC':'District of Columbia','FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'}

def ring_to_path(coords,mapper):
    pts=[]
    for lon,lat in coords:
        x,y=mapper(lon,lat)
        pts.append(f'{x},{y}')
    if len(pts)<3: return ''
    return 'M'+'L'.join(pts)+'Z'

def geometry_to_path(geom,mapper):
    if isinstance(geom,Polygon):
        return ring_to_path(geom.exterior.coords,mapper)+''.join(ring_to_path(r.coords,mapper) for r in geom.interiors)
    if isinstance(geom,MultiPolygon): return ''.join(geometry_to_path(p,mapper) for p in geom.geoms)
    if isinstance(geom,GeometryCollection): return ''.join(geometry_to_path(p,mapper) for p in geom.geoms)
    return ''

output=[]
for st,record in gdf.iterrows():
    if st=='PR': continue
    mapper=alaska if st=='AK' else hawaii if st=='HI' else mainland
    # Simplify geometry before projecting; focus on outline, not road navigation
    epsilon=0.10 if st=='AK' else 0.028 if st=='HI' else 0.050
    geom=record.geometry.simplify(epsilon,preserve_topology=True)
    centroid=record.geometry.representative_point()
    x,y=mapper(centroid.x,centroid.y)
    output.append({'abbr':st,'name':names[st],'path':geometry_to_path(geom,mapper),'cx':x,'cy':y})

payload={'viewBox':[0,0,1250,790], 'states':output,
         'attribution':'Basemap UScounties reference boundary data; simplified, illustrative state outlines only',
         'projection':'EPSG:5070 mainland, Alaska/Hawaii inset schematic'}
(root/'assets/data/us-state-geometry.json').write_text(json.dumps(payload,separators=(',',':')))
# Inline JavaScript so file:// works and the ZIP is offline-readable
(root/'assets/js/geography.js').write_text('window.ATLAS_GEOGRAPHY='+json.dumps(payload,separators=(',',':'))+';\n')
print('Generated',len(output),'states; size',round((root/'assets/js/geography.js').stat().st_size/1024),'KiB')
