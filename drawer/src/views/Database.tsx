import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { initDatabase } from "../../db/initDatabase";
import { getAllUsuarios } from "../../db/CRUD-Usuarios";
import { getAllNotas } from "../../db/CRUD-Notas";

type Usuario = {
	id: number;
	nombre: string;
	email: string;
	edad?: number;
	created_at?: string;
};

type Nota = {
	id: number;
	titulo: string;
	contenido?: string;
	usuario_id: number;
	created_at?: string;
};

export default function Database() {
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [notas, setNotas] = useState<Nota[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchData = useCallback(async () => {
		const [usersRaw, notesRaw] = await Promise.all([getAllUsuarios(), getAllNotas()]);

		const users = (usersRaw as any[]).map((u) => ({
			id: Number(u.id),
			nombre: String(u.nombre ?? "Sin nombre"),
			email: String(u.email ?? "Sin email"),
			edad: u.edad != null ? Number(u.edad) : undefined,
			created_at: u.created_at ? String(u.created_at) : undefined,
		}));

		const notes = (notesRaw as any[]).map((n) => ({
			id: Number(n.id),
			titulo: String(n.titulo ?? "Sin título"),
			contenido: n.contenido ? String(n.contenido) : "",
			usuario_id: Number(n.usuario_id),
			created_at: n.created_at ? String(n.created_at) : undefined,
		}));

		setUsuarios(users);
		setNotas(notes);
	}, []);

	const cargar = useCallback(async () => {
		try {
			await initDatabase();
			await fetchData();
		} catch (error) {
			Alert.alert(
				"Error",
				`No se pudo cargar el listado: ${error instanceof Error ? error.message : String(error)}`
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [fetchData]);

	useEffect(() => {
		cargar();
	}, [cargar]);

	const notasPorUsuario = useMemo(() => {
		const grouped: Record<number, Nota[]> = {};
		for (const nota of notas) {
			if (!grouped[nota.usuario_id]) {
				grouped[nota.usuario_id] = [];
			}
			grouped[nota.usuario_id].push(nota);
		}
		return grouped;
	}, [notas]);

    // formatear fechas a formato legible
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Sin fecha";
        const date = new Date(dateString);
        return date.toLocaleString();
    };

	const onRefresh = async () => {
		setRefreshing(true);
		await cargar();
	};

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#1d4ed8" />
				<Text style={styles.loadingText}>Cargando usuarios y notas...</Text>
			</View>
		);
	}

	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={styles.container}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
		>
			<View style={styles.headerRow}>
				<Text style={styles.title}>notas de usuarios</Text>
				
			</View>

			<Text style={styles.subtitle}>
				Usuarios: {usuarios.length} | Notas: {notas.length}
			</Text>

			{usuarios.length === 0 ? (
				<View style={styles.emptyCard}>
					<Text style={styles.emptyText}>No hay usuarios registrados.</Text>
				</View>
			) : (
				usuarios.map((usuario) => {
					const notasUsuario = notasPorUsuario[usuario.id] ?? [];
					return (
						<View key={usuario.id} style={styles.userCard}>
							<Text style={styles.userTitle}>{usuario.nombre}</Text>
							<Text style={styles.userMeta}>ID: {usuario.id}</Text>
							<Text style={styles.userMeta}>Email: {usuario.email}</Text>
							<Text style={styles.userMeta}>
								Edad: {usuario.edad ?? "No registrada"}
							</Text>
							<Text style={styles.userMeta}>
								Creado: {formatDate(usuario.created_at)}
							</Text>

							<View style={styles.notesSection}>
								<Text style={styles.notesTitle}>Notas ({notasUsuario.length})</Text>

								{notasUsuario.length === 0 ? (
									<Text style={styles.noNotes}>Vacio...</Text>
								) : (
									notasUsuario.map((nota) => (
										<View key={nota.id} style={styles.noteCard}>
											<Text style={styles.noteTitle}>{nota.titulo}</Text>
											<Text style={styles.noteBody}>
												{nota.contenido || "Sin contenido"}
											</Text>
											<Text style={styles.noteMeta}>Nota ID: {nota.id}</Text>
											<Text style={styles.noteMeta}>
												Fecha: {formatDate(nota.created_at)}
											</Text>
										</View>
									))
								)}
							</View>
						</View>
					);
				})
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		backgroundColor: "#f8fafc",
	},
	container: {
		padding: 16,
		gap: 14,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
		backgroundColor: "#f8fafc",
	},
	loadingText: {
		color: "#334155",
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 24,
		fontWeight: "800",
		color: "#0f172a",
	},
	subtitle: {
		color: "#475569",
		fontSize: 14,
	},
	refreshButton: {
		backgroundColor: "#1d4ed8",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
	},
	refreshButtonText: {
		color: "#fff",
		fontWeight: "700",
	},
	emptyCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		borderColor: "#e2e8f0",
		borderWidth: 1,
	},
	emptyText: {
		color: "#64748b",
		fontStyle: "italic",
	},
	userCard: {
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 12,
		padding: 14,
		gap: 4,
	},
	userTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#0f172a",
		marginBottom: 4,
	},
	userMeta: {
		color: "#334155",
	},
	notesSection: {
		marginTop: 10,
		gap: 8,
	},
	notesTitle: {
		fontSize: 15,
		fontWeight: "700",
		color: "#1e293b",
	},
	noNotes: {
		color: "#64748b",
		fontStyle: "italic",
	},
	noteCard: {
		backgroundColor: "#f8fafc",
		borderWidth: 1,
		borderColor: "#dbeafe",
		borderRadius: 10,
		padding: 10,
		gap: 3,
	},
	noteTitle: {
		fontWeight: "700",
		color: "#0f172a",
	},
	noteBody: {
		color: "#334155",
	},
	noteMeta: {
		color: "#64748b",
		fontSize: 12,
	},
});
